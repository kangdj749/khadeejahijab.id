import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sheets/products";

export async function GET() {
  const products = await getProducts();

  return NextResponse.json({
    featured: products.slice(0, 8),

    // sementara: best seller = produk dengan discount / harga menarik
    bestSeller: products
      .filter((p) => p.discountPrice && p.discountPrice < p.price)
      .slice(0, 8),
  });
}
