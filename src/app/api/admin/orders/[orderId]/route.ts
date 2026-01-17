import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/google-sheet";

type Params = {
  params: {
    orderid: string;
  };
};

export async function GET(
  req: Request,
  { params }: Params
) {
  const orderId = params.orderid;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID missing" },
      { status: 400 }
    );
  }

  const raw = await getOrderById(orderId);

  if (!raw) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  /* =========================
     NORMALIZE ORDER (API CONTRACT)
  ========================= */

  const order = {
    order_id: raw.order_id,
    created_at: raw.created_at,

    // ✅ ambil dari customer object
    name: raw.customer?.name ?? "",
    phone: raw.customer?.phone ?? "",
    address: raw.customer?.address ?? "",

    total: Number(raw.total || 0),

    payment_status: raw.payment_status ?? "pending",
    payment_method: raw.payment_method ?? null,

    affiliate_code: raw.affiliate_code ?? null,
  };

  return NextResponse.json(order);
}
