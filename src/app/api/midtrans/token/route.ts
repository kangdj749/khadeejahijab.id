import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { updateSnapToken } from "@/lib/google-sheet";
import { truncateItemName } from "@/lib/midtrans";

/* ================= TYPES ================= */

interface ItemPayload {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface ShippingPayload {
  courier: string;
  service: string;
  cost: number;
}

interface CustomerPayload {
  name: string;
  phone: string;
  address: string;
}

interface MidtransPayload {
  orderId: string;
  items: ItemPayload[];
  shipping: ShippingPayload;
  customer: CustomerPayload;
}

/* ================= MIDTRANS ================= */

const snap = new midtransClient.Snap({
  isProduction: false, // ganti true saat live
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

/* ================= HANDLER ================= */

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MidtransPayload;

    /* ---------- ITEM DETAILS ---------- */
    const item_details = body.items.map((i) => ({
      id: String(i.id),
      name: truncateItemName(i.name),
      price: Number(i.price),
      quantity: Number(i.qty),
    }));

    /* ---------- ONGKIR SEBAGAI ITEM ---------- */
    if (body.shipping?.cost > 0) {
      item_details.push({
        id: "SHIPPING",
        name: `Ongkir ${body.shipping.courier} ${body.shipping.service}`,
        price: Number(body.shipping.cost),
        quantity: 1,
      });
    }

    /* ---------- GROSS AMOUNT ---------- */
    const gross_amount = item_details.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    /* ---------- CREATE TRANSACTION ---------- */
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: body.orderId,
        gross_amount,
      },
      item_details,
      customer_details: {
        first_name: body.customer.name,
        phone: body.customer.phone,
        billing_address: {
          address: body.customer.address,
        },
      },
    }as unknown as midtransClient.SnapTransactionParameters);

    /* ---------- SAVE TOKEN ---------- */
    await updateSnapToken(body.orderId, transaction.token);

    return NextResponse.json({ token: transaction.token });
  } catch (err) {
    console.error("MIDTRANS TOKEN ERROR", err);
    return NextResponse.json(
      { error: "Gagal membuat token Midtrans" },
      { status: 500 }
    );
  }
}
