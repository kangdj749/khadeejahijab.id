"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

type Props = { initialProducts?: Product[]; category?: string };

export default function ProductGridInfinite({ initialProducts, category }: Props) {
  const [products, setProducts] = useState<Product[]>(Array.isArray(initialProducts) ? initialProducts : []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 8;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (category) params.set("category", category);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setProducts((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
        if (data.length < limit) setHasMore(false);
      } else setHasMore(false);
    } catch (err) {
      console.error("❌ load more error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">Produk belum tersedia</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50"
          >
            {loading ? "Memuat..." : "Muat Produk Lainnya"}
          </button>
        </div>
      )}
    </>
  );
}
