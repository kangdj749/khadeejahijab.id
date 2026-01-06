import { NextResponse } from "next/server"
import crypto from "crypto"
import { getProducts } from "@/lib/sheets/products"
import { Product } from "@/types"

//export const runtime = "nodejs"

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL!

export const dynamic = "force-dynamic";

/* =====================
   GET: LIST PRODUK (PAGINATION)
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 8);
    const category = searchParams.get("category");

    let products: Product[] = await getProducts();

    // ✅ OPTIONAL FILTER CATEGORY
    if (category) {
      products = products.filter(
        (p) =>
          (p.category || "").trim().toLowerCase() ===
          category.trim().toLowerCase()
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return NextResponse.json(products.slice(start, end));
  } catch (err) {
    console.error("❌ API /products error:", err);
    return NextResponse.json([], { status: 200 }); // 🔥 jangan bikin frontend crash
  }
}
/* =====================
   POST: SIMPAN PRODUK (KEEP)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const payload = {
      id: crypto.randomUUID(),
      name: String(body.name),
      description: String(body.description || ""),
      image: String(body.image || ""),
      gallery: Array.isArray(body.gallery)
        ? body.gallery.filter(Boolean)
        : [],
      category: String(body.category || ""),
      tags: Array.isArray(body.tags) ? body.tags : [],
      price: Number(body.price),
      discountPrice: body.discountPrice || "",
      shopee: body.shopee || "",
      tokopedia: body.tokopedia || "",
      tiktok: body.tiktok || "",
      weight: Number(body.weight || 0),
      variations: Array.isArray(body.variations)
        ? body.variations
        : [],
    }

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()

    if (text.startsWith("<!DOCTYPE html")) {
      throw new Error("GOOGLE APPS SCRIPT REDIRECT")
    }

    const json = JSON.parse(text)

    if (!json.success) {
      throw new Error("Apps Script gagal simpan")
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("API POST /products:", err)
    return NextResponse.json(
      { error: "Submit produk gagal" },
      { status: 500 }
    )
  }
}
