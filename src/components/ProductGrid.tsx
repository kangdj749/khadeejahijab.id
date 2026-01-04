"use client";

import { useEffect, useState, useCallback } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/sheets/products";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 8;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const newProducts = await getProducts(page, LIMIT);

    if (newProducts.length < LIMIT) {
      setHasMore(false);
    }

    setProducts((prev) => [...prev, ...newProducts]);
    setPage((p) => p + 1);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <section id="produk" className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Memuat..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
