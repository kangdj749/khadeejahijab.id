import { NextResponse } from "next/server";
import { appendOrder } from "@/lib/google-sheet";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      customer,
      items,
      subtotal,
      shipping,
      total,
      affiliate, // ✅ OPTIONAL
    } = body;

    /* =========================
       VALIDATION MINIMAL
    ========================= */
    if (!orderId || !customer || !items || !shipping) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    /* =========================
       ROW SESUAI STRUKTUR SHEET
       A - Q
    ========================= */
    const row = [
      orderId,                                      // A order_id
      new Date().toISOString(),                     // B created_at
      customer.name,                                // C nama
      customer.phone,                               // D nohp
      customer.address,                             // E alamat
      customer.city,                                // F kota
      JSON.stringify(items),                        // G items
      subtotal,                                     // H subtotal
      shipping.cost,                                // I ongkir
      `${shipping.courier} - ${shipping.service}`,  // J shipping_service
      total,                                        // K total
      "midtrans",                                   // L payment_method (default)
      "pending",                                    // M payment_status
      "",                                           // N midtrans_order_id
      "",                                           // O snap_token (ISI NANTI)
      affiliate ?? "",                          // Q affiliate_code (TERAKHIR)
    ];

    await appendOrder(row);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err);
    return NextResponse.json(
      { error: "Create order failed" },
      { status: 500 }
    );
  }
}
