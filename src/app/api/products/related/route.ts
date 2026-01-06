import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sheets/products";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");

    if (!category) {
      return NextResponse.json([]);
    }

    const products: Product[] = await getProducts();

    const related = products.filter((p) => {
      if (!p.category) return false;

      const sameCategory =
        p.category.trim().toLowerCase() ===
        category.trim().toLowerCase();

      const notSelf = exclude ? String(p.id) !== exclude : true;

      return sameCategory && notSelf;
    });

    return NextResponse.json(related.slice(0, 8));
  } catch (err) {
    console.error("❌ related products error:", err);
    return NextResponse.json([]);
  }
}
