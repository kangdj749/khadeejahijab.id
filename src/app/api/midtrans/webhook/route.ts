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

type Payload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status:
    | "pending"
    | "settlement"
    | "capture"
    | "deny"
    | "cancel"
    | "expire";
  payment_type?: string;
};

/* ================= VERIFY ================= */

function verify(payload: Payload): boolean {
  const raw =
    payload.order_id +
    payload.status_code +
    payload.gross_amount +
    process.env.MIDTRANS_SERVER_KEY!;

  const hash = crypto.createHash("sha512").update(raw).digest("hex");
  return hash === payload.signature_key;
}

/* ================= WEBHOOK ================= */

export async function POST(req: Request) {
  try {
    const payload: Payload = await req.json();

    if (!verify(payload)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    /* ===== MAP STATUS ===== */
    let payment_status: "pending" | "paid" | "expired" | "failed" = "pending";

    if (["settlement", "capture"].includes(payload.transaction_status)) {
      payment_status = "paid";
    } else if (payload.transaction_status === "expire") {
      payment_status = "expired";
    } else if (["cancel", "deny"].includes(payload.transaction_status)) {
      payment_status = "failed";
    }

    /* ===== UPDATE ORDER (SAFE COLUMNS ONLY) ===== */
    await updatePaymentStatus(payload.order_id, {
      payment_method: payload.payment_type ?? "midtrans",
      payment_status,
      midtrans_order_id: payload.order_id,
    });

    /* ===== STOP IF NOT PAID ===== */
    if (payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    /* ===== AFFILIATE COMMISSION ===== */
    const order = await getOrderAffiliateAndTotal(payload.order_id);
    if (!order || !order.affiliate_code) {
      return NextResponse.json({ received: true });
    }

    const percent = await getAffiliatePercent(order.affiliate_code);
    if (!percent) {
      return NextResponse.json({ received: true });
    }

    const exists = await affiliateCommissionExists(payload.order_id);
    if (exists) {
      return NextResponse.json({ received: true });
    }

    const commission = (order.total * percent) / 100;

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
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
