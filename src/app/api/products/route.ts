import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sheets/products";
import { Product } from "@/types";

export const runtime = "nodejs";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL!;

/* =====================
   GET: LIST PRODUK
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    const products: Product[] = await getProducts();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return NextResponse.json(products.slice(startIndex, endIndex));
  } catch (err) {
    console.error("API GET /products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* =====================
   POST: SIMPAN PRODUK
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      id: crypto.randomUUID(),
      name: String(body.name),
      description: String(body.description || ""),
      image: String(body.image || ""),
      gallery: Array.isArray(body.gallery)? body.gallery.filter(Boolean): [],
      category: String(body.category || ""),
      tags: Array.isArray(body.tags) ? body.tags : [],
      price: Number(body.price),
      discountPrice: body.discountPrice || "",
      shopee: body.shopee || "",
      tokopedia: body.tokopedia || "",
      tiktok: body.tiktok || "",
      weight: Number(body.weight || 0),
      variations: Array.isArray(body.variations) ? body.variations : [],
    };

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow", // 🔥 WAJIB
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    // 🔥 DETEKSI HTML GOOGLE
    if (text.startsWith("<!DOCTYPE html")) {
      throw new Error(
        "GOOGLE APPS SCRIPT REDIRECT (permission / deployment salah)"
      );
    }

    const json = JSON.parse(text);

    if (!json.success) {
      throw new Error("Apps Script gagal simpan");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API POST /products:", err);
    return NextResponse.json(
      { error: "Submit produk gagal" },
      { status: 500 }
    );
  }
}
