import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { getProductBySlug, getProducts } from "@/lib/sheets/products";
import { Product } from "@/types";
import { cloudinaryImage } from "@/lib/cloudinary";

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

  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const url = `${siteUrl}/produk/${product.slug}`;

  const imageUrl = product.image
    ? cloudinaryImage(product.image, 1200)
    : undefined;

  return {
    title: `${product.name} | Khadeeja Hijab`,
    description:
      product.description?.slice(0, 155) ||
      `Beli ${product.name} original Khadeeja Hijab. Ready stock & siap kirim.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description?.slice(0, 155),
      url,
      siteName: "Khadeeja Hijab",
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.slice(0, 155),
      images: imageUrl ? [imageUrl] : [],
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

  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const url = `${siteUrl}/produk/${product.slug}`;

  /* ===============================
     IMAGE URLS
  ================================ */
  const imageUrls = [
    product.image ? cloudinaryImage(product.image, 800) : null,
    ...(product.gallery || []).map((img) =>
      cloudinaryImage(img, 800)
    ),
  ].filter(Boolean) as string[];

  /* ===============================
     RELATED PRODUCTS (SILO)
  ================================ */
  const allProducts: Product[] = await getProducts();

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.slug !== product.slug &&
        p.category &&
        p.category === product.category
    )
    .slice(0, 6);

  /* ===============================
     FAQ DATA (BUYING INTENT)
  ================================ */
  const faqItems = [
  {
    q: `Apakah ${product.name} cocok untuk penggunaan harian?`,
    a: `${product.name} dirancang nyaman digunakan untuk aktivitas harian maupun acara formal.`,
  },
  {
    q: `Bahan apa yang digunakan pada ${product.name}?`,
    a:
      product.description?.length
        ? product.description.slice(0, 120)
        : `${product.name} menggunakan bahan berkualitas pilihan yang nyaman digunakan.`,
  },
  {
    q: `Apakah ${product.name} ready stock?`,
    a: `Ya, ${product.name} ready stock dan siap dikirim ke seluruh Indonesia.`,
  },
];


  return (
    <>
      {/* ================= BREADCRUMB SCHEMA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Beranda",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Produk",
                item: `${siteUrl}/produk`,
              },
              ...(product.category
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: product.category,
                      item: `${siteUrl}/produk?category=${encodeURIComponent(
                        product.category
                      )}`,
                    },
                  ]
                : []),
              {
                "@type": "ListItem",
                position: 4,
                name: product.name,
                item: url,
              },
            ],
          }),
        }}
      />

      {/* ================= PRODUCT SCHEMA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: imageUrls,
            description: product.description,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: "Khadeeja Hijab",
            },
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "IDR",
              price: product.discountPrice ?? product.price,
              availability: "https://schema.org/InStock",
              itemCondition:
                "https://schema.org/NewCondition",
            },
          }),
        }}
      />

      {/* ================= FAQ SCHEMA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />

      {/* ================= UI ================= */}
      <ProductDetailClient
        product={product}
      />

      {/* ================= RELATED PRODUCTS ================= */}
      
      {/* ================= SEO SILO (HIDDEN LINKS) ================= */}
      {relatedProducts.length > 0 && (
        <nav
          aria-label="Produk Terkait"
          className="sr-only"
        >
          <ul>
            {relatedProducts.map((p) => (
              <li key={p.id}>
                <a href={`/produk/${p.slug}`}>
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}


      {/* ================= CATEGORY BACKLINK ================= */}
      {product.category && (
        <div className="max-w-6xl mx-auto px-4 mt-10 text-sm">
          <a
            href={`/produk?category=${encodeURIComponent(
              product.category
            )}`}
            className="text-primary underline"
          >
            Lihat koleksi {product.category} lainnya →
          </a>
        </div>
      )}
    </>
  );
}
