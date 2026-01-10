import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Image from "next/image";
import { getKoleksiBySlug } from "@/lib/sheets/koleksi";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { cloudinaryImage } from "@/lib/cloudinary";
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

  const description =
    seo.excerpt ||
    seo.intro?.replace(/<[^>]+>/g, "").slice(0, 155);

  return {
    title: seo.h1,
    description,
    alternates: {
      canonical: `${siteUrl}/koleksi/${seo.slug}`,
    },
    openGraph: {
      title: seo.h1,
      description,
      images: seo.image
        ? [cloudinaryImage(seo.image, 1200)]
        : [],
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
    <main className="space-y-16 pt-20 pb-20">

      {/* ================= HERO ================= */}
      {(seo.image || seo.h1) && (
        <section className="relative">
          {seo.image && (
            <div className="relative h-[40vh] min-h-[280px]">
              <Image
                src={cloudinaryImage(seo.image, 1200)!}
                alt={seo.h1}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-4 pb-8 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {seo.h1}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* ================= INTRO ================= */}
      <section className="max-w-6xl mx-auto px-4 space-y-4">
        {seo.intro && (
          <div
            className="prose max-w-3xl text-gray-700"
            dangerouslySetInnerHTML={{ __html: seo.intro }}
          />
        )}

        <a
          href="#produk"
          className="inline-block text-sm font-medium text-primary underline"
        >
          Lihat produk →
        </a>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600">
        {["Ready Stock", "Pengiriman Cepat", "Produk Original"].map(
          (text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {text}
            </div>
          )
        )}
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section id="produk" className="max-w-6xl mx-auto px-4">
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
