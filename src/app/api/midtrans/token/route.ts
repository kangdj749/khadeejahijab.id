import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { appendSheet } from "@/lib/google-sheet";
import type { CheckoutData } from "@/lib/format-wa";

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutData;

    /* ================= VALIDATION ================= */
    if (!body.orderId || !body.customer || body.items.length === 0) {
      return NextResponse.json(
        { message: "Invalid checkout data" },
        { status: 400 }
      );
    }

    /* ================= MIDTRANS INIT ================= */
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    /* ================= ITEMS ================= */
    const item_details = body.items.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      quantity: item.qty, // ✅ Midtrans wajib "quantity"
    }));

    // Ongkir sebagai item
    item_details.push({
      id: "ONGKIR",
      name: `Ongkir (${body.shipping.courier.toUpperCase()} - ${body.shipping.service})`,
      price: body.shipping.cost,
      quantity: 1,
    });

    /* ================= PARAMS ================= */
    const params = {
      transaction_details: {
        order_id: body.orderId,
        gross_amount: body.total,
      },
      item_details,
      customer_details: {
        first_name: body.customer.name,
        phone: body.customer.phone,
        billing_address: {
          address: body.customer.address,
        },
      },
    };

    /* ================= CREATE TOKEN ================= */
    const snapRes = await snap.createTransaction(params);

    /* ================= UPDATE GOOGLE SHEET ================= */
    await appendSheet("pending_orders", [
      body.orderId,
      new Date().toISOString(),

      body.customer.name,
      body.customer.phone,
      body.customer.address,
      "-",

      JSON.stringify(body.items),

      body.subtotal,
      body.shipping.cost,
      `${body.shipping.courier.toUpperCase()} - ${body.shipping.service}`,

      body.total,

      body.payment_method,
      "pending",

      body.orderId,
      snapRes.token,
    ]);

    return NextResponse.json({
      token: snapRes.token,
      midtrans_order_id: body.orderId,
    });
    } catch (err: unknown) {
    console.error("MIDTRANS TOKEN ERROR", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Midtrans token error" },
      { status: 500 }
    );
}

}
