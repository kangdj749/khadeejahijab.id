import { NextResponse } from "next/server";
import { getOrdersForAdmin } from "@/lib/google-sheet";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as
    | "pending"
    | "paid"
    | null;

  const orders = await getOrdersForAdmin(
    status ?? undefined
  );

  return NextResponse.json(orders);
}
