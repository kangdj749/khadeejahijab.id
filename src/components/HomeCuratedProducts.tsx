"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export default function HomeCuratedProducts() {
  const [data, setData] = useState<{
    featured: Product[];
    bestSeller: Product[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/products/featured", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-12">
      <Section title="✨ Rekomendasi Kami" products={data.featured} />
      <Section title="🔥 Best Seller" products={data.bestSeller} />

      {/* CTA ke katalog penuh */}
      <div className="text-center pt-2">
        <Link
          href="/produk"
          className="inline-block text-pink-600 font-semibold hover:underline"
        >
          Lihat semua produk →
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
