"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductSearchBar from "@/components/ProductSearchBar";
import CategoryChips from "@/components/CategoryChips";

type Props = {
  products: Product[];
};

export default function HomeProductSection({ products }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /** ambil kategori unik */
  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ) as string[];
  }, [products]);

  /** filter produk */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );

      const matchCategory =
        category === "all" || p.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <section className="space-y-6">
      {/* SEARCH */}
      <ProductSearchBar value={search} onChange={setSearch} />

      {/* CATEGORY */}
      <CategoryChips
        categories={categories}
        active={category}
        onChange={setCategory}
      />

      {/* RESULT */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Produk tidak ditemukan
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
