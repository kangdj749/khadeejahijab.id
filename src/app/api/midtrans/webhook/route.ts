import { NextResponse } from "next/server";
import crypto from "crypto";
import { updatePaymentStatus } from "@/lib/google-sheet";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      signature_key,
      payment_type,
    } = body;

    /* ================= SIGNATURE VERIFY ================= */
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const rawSignature = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(rawSignature)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 403 }
      );
    }

    /* ================= MAP STATUS ================= */
    let payment_status: "paid" | "pending" | "expired" | "failed" = "pending";

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      payment_status = "paid";
    } else if (transaction_status === "expire") {
      payment_status = "expired";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      payment_status = "failed";
    }

    /* ================= UPDATE GOOGLE SHEET ================= */
    await updatePaymentStatus(order_id, {
      payment_status,
      payment_method: payment_type,
      midtrans_order_id: order_id,
    });


    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("MIDTRANS WEBHOOK ERROR", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Webhook error" },
      { status: 500 }
    );
  }

}
