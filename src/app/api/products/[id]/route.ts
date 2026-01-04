import { NextResponse } from "next/server"
import { getProducts } from "@/lib/sheets/products"
import { Product } from "@/types"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const products: Product[] = await getProducts()

    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (err) {
    console.error("API Error /products/[id]:", err)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
