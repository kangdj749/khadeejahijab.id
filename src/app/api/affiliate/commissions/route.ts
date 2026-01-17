import { NextResponse } from "next/server";
import { getAffiliateCommissions } from "@/lib/google-sheet";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Affiliate code required" }, { status: 400 });
  }

  const data = await getAffiliateCommissions(code);
  return NextResponse.json(data);
}
