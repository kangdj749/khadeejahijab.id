import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { updateSnapToken } from "@/lib/google-sheet";

interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Payload {
  orderId: string;
  items: Item[];
  customer: {
    name: string;
    phone: string;
    address: string;
  };
}

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

export async function POST(req: Request) {
  const body = (await req.json()) as Payload;

  const item_details = body.items.map((i) => ({
    id: i.id,
    name: i.name,
    price: Number(i.price),
    quantity: Number(i.qty),
  }));

  const gross_amount = item_details.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

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
  } as any);

  // ✅ SIMPAN SNAP TOKEN KE SHEET
  await updateSnapToken(body.orderId, transaction.token);

  return NextResponse.json({
    token: transaction.token,
  });
}
