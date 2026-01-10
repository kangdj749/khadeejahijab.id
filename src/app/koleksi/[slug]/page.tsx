import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getKoleksiBySlug } from "@/lib/sheets/koleksi";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { CheckCircle } from "lucide-react";

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const seo = await getKoleksiBySlug(params.slug);
  if (!seo) return {};

  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  return {
    title: seo.h1,
    description: seo.intro
      ?.replace(/<[^>]+>/g, "")
      .slice(0, 155),
    alternates: {
      canonical: `${siteUrl}/koleksi/${seo.slug}`,
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function KoleksiPage({
  params,
}: {
  params: { slug: string };
}) {
  const seo = await getKoleksiBySlug(params.slug);
  if (!seo) return notFound();

  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const apiUrl = `${protocol}://${host}/api/products?category=${encodeURIComponent(
    seo.product_category
  )}`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil produk");

  const data: { items: Product[] } = await res.json();
  const products = Array.isArray(data.items) ? data.items : [];

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20 pb-16 space-y-14">

      {/* ================= HERO ================= */}
      <section className="space-y-4 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          {seo.h1}
        </h1>

        {seo.intro && (
          <div
            className="text-gray-700 leading-relaxed prose"
            dangerouslySetInnerHTML={{ __html: seo.intro }}
          />
        )}

        <a
          href="#produk"
          className="inline-block mt-2 text-sm font-medium text-primary underline"
        >
          Lihat produk →
        </a>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="grid grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600 max-w-xl">
        {[
          "Ready Stock",
          "Pengiriman Cepat",
          "Produk Original",
        ].map((text) => (
          <div key={text} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            {text}
          </div>
        ))}
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section id="produk">
        {products.length === 0 ? (
          <p className="text-gray-500 py-20 text-center">
            Produk belum tersedia
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= FAQ SCHEMA ================= */}
      {seo.faq_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: JSON.parse(seo.faq_json).map(
                (item: { q: string; a: string }) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                  },
                })
              ),
            }),
          }}
        />
      )}
    </main>
  );
}
