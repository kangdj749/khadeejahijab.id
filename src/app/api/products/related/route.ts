export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sheets/products";
import { Product } from "@/types";

// 🔹 Endpoint: /api/products/related?category=Fashion&exclude=P001
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const excludeId = searchParams.get("exclude");

    if (!category) {
      return NextResponse.json(
        { error: "Parameter 'category' diperlukan" },
        { status: 400 }
      );
    }

    const products: Product[] = await getProducts();

    // Normalisasi kategori dan filter produk terkait
    const related = products.filter((p) => {
      const cat = (p.category || "").trim().toLowerCase();
      return (
        cat === category.trim().toLowerCase() &&
        (!excludeId || p.id !== excludeId)
      );
    });

    // Kalau hasilnya kosong, tampilkan produk random sebagai fallback
    const result =
      related.length > 0
        ? related.sort(() => Math.random() - 0.5).slice(0, 4)
        : products
            .filter((p) => p.id !== excludeId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ API Error /products/related:", err);
    return NextResponse.json(
      { error: "Gagal memuat produk terkait" },
      { status: 500 }
    );
  }
}
