import type { Metadata } from "next";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import SearchBarClient from "@/components/SearchBarClient";
import CategoryTabsClient from "@/components/CategoryTabsClient";
import { getProducts } from "@/lib/sheets/products";

/* =========================
   TYPES
========================= */
type Props = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

/* =========================
   SEO METADATA (SERVER)
========================= */
export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const rawKeyword = searchParams.q || "";
  const keyword = rawKeyword.trim();
  const category = searchParams.category || "";

  // ❌ query terlalu pendek → noindex
  if (keyword.length < 3) {
    return {
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const titleParts = [
    `Cari ${keyword}`,
    category && `Kategori ${category}`,
    "Khadeeja Hijab",
  ].filter(Boolean);

  return {
    title: titleParts.join(" | "),
    description: `Temukan produk ${keyword}${
      category ? ` kategori ${category}` : ""
    } terbaru & terbaik di Khadeeja Hijab.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function SearchPage({ searchParams }: Props) {
  /** RAW QUERY (UI) */
  const rawKeyword = searchParams.q || "";
  const rawCategory = searchParams.category || "all";

  /** NORMALIZED (FILTER) */
  const keyword = rawKeyword.trim().toLowerCase();
  const activeCategory = rawCategory.trim().toLowerCase();

  const products: Product[] = await getProducts();

  /** FILTER (FIX & STABLE) */
  const filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const tags = Array.isArray(p.tags)
      ? p.tags.map((t) => t.toLowerCase())
      : [];

    const matchKeyword =
      !keyword ||
      name.includes(keyword) ||
      tags.some((t) => t.includes(keyword));

    const matchCategory =
      activeCategory === "all" || category === activeCategory;

    return matchKeyword && matchCategory;
  });

  /** KATEGORI */
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  /** ❌ NOINDEX JIKA HASIL KOSONG */
  const shouldIndex =
    keyword.length >= 3 && filtered.length > 0;

  return (
    <main
      key={`${rawKeyword}-${rawCategory}`}
      className="max-w-6xl mx-auto px-4 py-10 space-y-8"
      {...(!shouldIndex && { "data-noindex": true })}
    >
      <h1 className="text-2xl font-bold">
        Hasil pencarian {rawKeyword && `“${rawKeyword}”`}
      </h1>

      {/* SEARCH */}
      <SearchBarClient defaultValue={rawKeyword} />

      {/* CATEGORY */}
      <CategoryTabsClient
        categories={categories}
        active={rawCategory}
      />

      {/* RESULT */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          Produk tidak ditemukan
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
