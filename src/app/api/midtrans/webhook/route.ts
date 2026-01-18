import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  updatePaymentStatus,
  getOrderAffiliateAndTotal,
  getAffiliatePercent,
  affiliateCommissionExists,
  appendAffiliateCommission,
} from "@/lib/google-sheet";

export const dynamic = "force-dynamic";

/* ================= TYPES ================= */

type MidtransStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire"
  | "refund"
  | "partial_refund";

type Payload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: MidtransStatus;
  payment_type?: string;
};

/* ================= VERIFY SIGNATURE ================= */

function verifySignature(payload: Payload): boolean {
  const raw =
    payload.order_id +
    payload.status_code +
    payload.gross_amount +
    process.env.MIDTRANS_SERVER_KEY!;

  const hash = crypto.createHash("sha512").update(raw).digest("hex");
  return hash === payload.signature_key;
}

/* ================= MAP STATUS ================= */

function mapPaymentStatus(
  status: MidtransStatus
): "pending" | "paid" | "expired" | "failed" | "refunded" {
  if (status === "settlement" || status === "capture") return "paid";
  if (status === "expire") return "expired";
  if (status === "refund" || status === "partial_refund") return "refunded";
  if (status === "cancel" || status === "deny") return "failed";
  return "pending";
}

/* ================= WEBHOOK ================= */

export async function POST(req: Request) {
  try {
    const payload: Payload = await req.json();

    /* 🔐 VERIFY MIDTRANS (SSOT) */
    if (!verifySignature(payload)) {
      console.error("❌ Invalid Midtrans signature", payload.order_id);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    const payment_status = mapPaymentStatus(payload.transaction_status);

    /* 📝 UPDATE LEDGER (GOOGLE SHEET) */
    await updatePaymentStatus(payload.order_id, {
      payment_method: "midtrans",
      payment_status,
      midtrans_order_id: payload.order_id,
    });

    /* 🛑 STOP IF NOT PAID */
    if (payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    /* ================= AFFILIATE ================= */

    // 🔒 IDEMPOTENCY GUARD (PALING PENTING)
    const commissionExists = await affiliateCommissionExists(payload.order_id);
    if (commissionExists) {
      return NextResponse.json({ received: true });
    }

    const order = await getOrderAffiliateAndTotal(payload.order_id);
    if (!order || !order.affiliate_code) {
      return NextResponse.json({ received: true });
    }

    const percent = await getAffiliatePercent(order.affiliate_code);
    if (!percent || percent <= 0) {
      return NextResponse.json({ received: true });
    }

    const commission = Math.round((order.total * percent) / 100);

    await appendAffiliateCommission([
      payload.order_id,
      order.affiliate_code,
      order.total,
      commission,
      "earned",
      new Date().toISOString(),
    ]);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ MIDTRANS WEBHOOK ERROR", err);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}
