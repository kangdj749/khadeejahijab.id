import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProducts } from "@/lib/sheets/products";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL!;

/* =====================
   GET: LIST PRODUK (SEO PAGINATION)
   SUPPORT:
   - page
   - limit
   - category
   - q (search keyword, optional – future ready)
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.max(Number(searchParams.get("limit") || 12), 1);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    let products: Product[] = await getProducts();

    /* =====================
       FILTER: CATEGORY
    ===================== */
    if (category) {
      const cat = category.trim().toLowerCase();
      products = products.filter(
        (p) => (p.category || "").trim().toLowerCase() === cat
      );
    }

    /* =====================
       FILTER: SEARCH (SEO READY)
    ===================== */
    if (q) {
      const keyword = q.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword) ||
          p.tags?.some((t) => t.toLowerCase().includes(keyword))
      );
    }

    const totalItems = products.length;
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    const start = (page - 1) * limit;
    const end = start + limit;

    const items = products.slice(start, end);

    return NextResponse.json({
      items,
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) {
    console.error("❌ API GET /products error:", err);

    // ⚠️ JANGAN bikin frontend crash
    return NextResponse.json(
      {
        items: [],
        page: 1,
        limit: 12,
        totalItems: 0,
        totalPages: 1,
      },
      { status: 200 }
    );
  }
}

/* =====================
   POST: SIMPAN PRODUK (KEEP)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload: Product = {
      id: crypto.randomUUID(),
      name: String(body.name),
      slug: String(body.slug),
      description: String(body.description || ""),
      image: String(body.image || ""),
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      category: String(body.category || ""),
      tags: Array.isArray(body.tags) ? body.tags : [],
      price: Number(body.price),
      discountPrice: body.discountPrice
        ? Number(body.discountPrice)
        : undefined,
      weight: Number(body.weight || 0),

      variations: Array.isArray(body.variations)
        ? body.variations
        : [],

      variants: Array.isArray(body.variants)
        ? body.variants
        : [],

      // ✅ BENAR: MASUK KE marketplace
      marketplace: {
        shopee: body.shopee || undefined,
        tokopedia: body.tokopedia || undefined,
        tiktok: body.tiktok || undefined,
      },
    };


    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    // 🔥 proteksi redirect Apps Script
    if (text.startsWith("<!DOCTYPE html")) {
      throw new Error("GOOGLE APPS SCRIPT REDIRECT");
    }

    const json = JSON.parse(text);

    if (!json.success) {
      throw new Error("Apps Script gagal simpan");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ API POST /products error:", err);
    return NextResponse.json(
      { error: "Submit produk gagal" },
      { status: 500 }
    );
  }
}
