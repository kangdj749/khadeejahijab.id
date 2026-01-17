import { NextResponse } from "next/server";
import {
  updatePaymentStatus,
  getOrderAffiliateAndTotal,
  getAffiliatePercent,
  affiliateCommissionExists,
  appendAffiliateCommission,
} from "@/lib/google-sheet";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const order = await getOrderAffiliateAndTotal(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 🔒 IDMPOTENT GUARD (SATU-SATUNYA)
    const exists = await affiliateCommissionExists(orderId);
    if (exists) {
      return NextResponse.json({ ok: true });
    }

    /* =========================
       UPDATE PAYMENT
    ========================= */
    await updatePaymentStatus(orderId, {
      payment_status: "paid",
      payment_method: "manual",
    });

    /* =========================
       AFFILIATE COMMISSION
    ========================= */
    if (!order.affiliate_code) {
      return NextResponse.json({ ok: true });
    }

    const percent = await getAffiliatePercent(order.affiliate_code);
    if (!percent) {
      return NextResponse.json({ ok: true });
    }

    const commission = (order.total * percent) / 100;

    await appendAffiliateCommission([
      orderId,
      order.affiliate_code,
      order.total,
      commission,
      "earned",
      new Date().toISOString(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ MARK PAID ERROR", err);
    return NextResponse.json(
      { error: "Mark paid failed" },
      { status: 500 }
    );
  }
}
