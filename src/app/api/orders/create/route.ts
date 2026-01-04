import { NextResponse } from "next/server";
import { appendSheet } from "@/lib/google-sheet";
import type { PendingOrder } from "@/types/order";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PendingOrder;

    /* ================= VALIDATION ================= */
    if (
      !body.orderId ||
      !body.customer?.name ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    /* ================= PREPARE ROW ================= */
    await appendSheet("pending_orders", [
      body.orderId,
      body.created_at ?? new Date().toISOString(),

      body.customer.name,
      body.customer.phone,
      body.customer.address,
      body.customer.city || "-", // ✅ FIX UTAMA
      
      JSON.stringify(body.items),

      body.subtotal,
      body.shipping?.cost ?? 0,
      body.shipping
        ? `${body.shipping.courier.toUpperCase()} - ${body.shipping.service}`
        : "-",

      body.total,

      body.payment_method,
      body.payment_status,

      body.midtrans_order_id ?? "",
      body.snap_token ?? "",
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CREATE ORDER ERROR", err);
    return NextResponse.json(
      { message: "Gagal menyimpan order" },
      { status: 500 }
    );
  }
}
