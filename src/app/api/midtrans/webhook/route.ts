import { NextResponse } from "next/server";
import crypto from "crypto";
import { updatePaymentStatus } from "@/lib/google-sheet";

export const dynamic = "force-dynamic";

/* ================= TYPES ================= */

type MidtransWebhookPayload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status:
    | "capture"
    | "settlement"
    | "pending"
    | "deny"
    | "cancel"
    | "expire";
  payment_type?: string;
};

/* ================= SIGNATURE CHECK ================= */

function verifySignature(payload: MidtransWebhookPayload): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;

  const hash = crypto
    .createHash("sha512")
    .update(raw)
    .digest("hex");

  return hash === payload.signature_key;
}

/* ================= WEBHOOK ================= */

export async function POST(req: Request) {
  try {
    const payload =
      (await req.json()) as MidtransWebhookPayload;

    /* 1️⃣ VERIFY SIGNATURE */
    if (!verifySignature(payload)) {
      console.error("❌ Invalid Midtrans signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const {
      order_id,
      transaction_status,
      payment_type,
    } = payload;

    /* 2️⃣ MAP STATUS */
    let payment_status: "pending" | "paid" | "expired" | "failed" =
      "pending";

    if (transaction_status === "settlement") {
      payment_status = "paid";
    } else if (transaction_status === "expire") {
      payment_status = "expired";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      payment_status = "failed";
    }

    /* 3️⃣ UPDATE GOOGLE SHEET */
    await updatePaymentStatus(order_id, {
      payment_status,
      payment_method: payment_type,
      midtrans_order_id: order_id,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ MIDTRANS WEBHOOK ERROR", err);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}
