export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import SearchBarClient from "@/components/SearchBarClient";
import CategoryTabsClient from "@/components/CategoryTabsClient";
import { getProducts } from "@/lib/sheets/products";
import { slugify } from "@/lib/slugify";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const keyword = (searchParams.q || "").trim();
  const category = searchParams.category || "";

  if (keyword.length < 3) {
    return { robots: { index: false, follow: true } };
  }

  return {
    title: [`Cari ${keyword}`, category && `Kategori ${category}`, "Khadeeja Hijab"]
      .filter(Boolean)
      .join(" | "),
    description: `Temukan produk ${keyword}${category ? ` kategori ${category}` : ""}`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const rawKeyword = searchParams.q || "";
  const rawCategory = searchParams.category || "all";

  const keyword = rawKeyword.trim().toLowerCase();
  const activeCategory = rawCategory.toLowerCase();

  const products: Product[] = await getProducts();

  const filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const tags = Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [];
    const categorySlug = slugify(p.category || "");

    const matchKeyword =
      !keyword || name.includes(keyword) || tags.some((t) => t.includes(keyword));

    const matchCategory =
      activeCategory === "all" || categorySlug === activeCategory;

    return matchKeyword && matchCategory;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">
        Hasil pencarian {rawKeyword && `“${rawKeyword}”`}
      </h1>

      <Suspense fallback={null}>
        <SearchBarClient defaultValue={rawKeyword} />
      </Suspense>

      <Suspense fallback={null}>
        <CategoryTabsClient categories={categories} active={rawCategory} />
      </Suspense>

      {filtered.length === 0 ? (
        <p className="text-center text-muted py-20">Produk tidak ditemukan</p>
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
