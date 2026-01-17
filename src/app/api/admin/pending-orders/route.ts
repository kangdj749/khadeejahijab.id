import { NextResponse } from "next/server";
import { getPendingOrders } from "@/lib/google-sheet";

export async function GET() {
  const orders = await getPendingOrders();
  return NextResponse.json(orders);
}
