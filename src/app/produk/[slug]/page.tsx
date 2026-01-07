  import type { Metadata } from "next";
  import { notFound } from "next/navigation";
  import ProductDetailClient from "./product-detail-client";
  import { getProductBySlug } from "@/lib/sheets/products";
  import { Product } from "@/types";

  export const dynamic = "force-dynamic";

  /* ===============================
    SERVER DATA
  ================================ */
  async function fetchProduct(slug: string): Promise<Product | null> {
    return (await getProductBySlug(slug)) ?? null;
  }

  /* ===============================
    METADATA (SEO)
  ================================ */
  export async function generateMetadata(
    { params }: { params: { slug: string } }
  ): Promise<Metadata> {
    const product = await fetchProduct(params.slug);
    if (!product) return {};

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/produk/${product.slug}`;

    return {
      title: `${product.name} | Khadeeja Hijab`,
      description:
        product.description?.slice(0, 155) ||
        "Koleksi hijab & fashion muslimah terbaik.",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: product.name,
        description:
          product.description?.slice(0, 155),
        url,
        siteName: "Khadeeja Hijab",
        images: product.image ? [product.image] : [],
      },
    };
  }

  /* ===============================
    PAGE
  ================================ */
  export default async function ProductPage({
    params,
  }: {
    params: { slug: string };
  }) {
    const product = await fetchProduct(params.slug);
    if (!product) return notFound();

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/produk/${product.slug}`;

    return (
      <>
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: [product.image, ...(product.gallery || [])].filter(Boolean),
              description: product.description,
              sku: product.id,
              brand: {
                "@type": "Brand",
                name: "Khadeeja Hijab",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "IDR",
                price: product.discountPrice ?? product.price,
                availability: "https://schema.org/InStock",
                url,
              },
            }),
          }}
        />

        <ProductDetailClient product={product} />
      </>
    );
  }
