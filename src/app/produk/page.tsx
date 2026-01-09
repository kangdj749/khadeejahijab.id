import type { Metadata } from "next";
import { headers } from "next/headers";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Product } from "@/types";
import {
  getCategorySEO,
  getAllCategorySEO,
} from "@/lib/sheets/categories";

type ProdukPageProps = {
  searchParams: {
    page?: string;
    category?: string;
  };
};

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata(
  { searchParams }: ProdukPageProps
): Promise<Metadata> {
  const category = searchParams.category;
  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  if (!category) {
    return {
      title: "Semua Produk | Khadeeja Hijab",
      description:
        "Koleksi lengkap produk Khadeeja Hijab terbaru, terlaris, dan siap kirim.",
      alternates: {
        canonical: `${siteUrl}/produk`,
      },
    };
  }

  const categorySEO = category? await getCategorySEO(category): null;

  if (categorySEO?.seo_title) {
    return {
      title: categorySEO.seo_title,
      description: categorySEO.seo_description,
      alternates: {
        canonical: `${siteUrl}/produk?category=${category}`,
      },
    };
  }

  const readableCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${readableCategory} Terbaru | Khadeeja Hijab`,
    description: `Temukan koleksi ${readableCategory} terbaru & siap kirim di Khadeeja Hijab.`,
    alternates: {
      canonical: `${siteUrl}/produk?category=${category}`,
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const page = Number(searchParams.page ?? "1");
  const limit = 12;
  const category = searchParams.category ?? "";

  const host = headers().get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const apiUrl = `${protocol}://${host}/api/products?page=${page}&limit=${limit}${
    category ? `&category=${encodeURIComponent(category)}` : ""
  }`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil produk");

  const data: {
    items: Product[];
    totalPages: number;
  } = await res.json();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const readableCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  const categorySEO = category ? await getCategorySEO(category) : null;

  /* =========================
     INTERNAL LINK SILO
  ========================= */
  const allCategories = await getAllCategorySEO();

  const relatedCategories = category
    ? allCategories
        .filter((c) => c.slug !== category)
        .slice(0, 8)
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      {/* ================= ITEMLIST SCHEMA ================= */}
      {data.items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: category
                ? `Produk kategori ${readableCategory}`
                : "Semua Produk",
              numberOfItems: data.items.length,
              itemListElement: data.items.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1 + (page - 1) * limit,
                url: `${siteUrl}/produk/${product.slug}`,
                name: product.name,
              })),
            }),
          }}
        />
      )}

      {/* ================= BREADCRUMB ================= */}
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
              ...(category
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: readableCategory,
                      item: `${siteUrl}/produk?category=${category}`,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />

      {/* ================= HEADER ================= */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {category ? readableCategory : "Semua Produk"}
        </h1>

        {category && (
          <p className="text-sm text-gray-500 mt-1">
            Koleksi {readableCategory} terbaik & terbaru
          </p>
        )}
      </header>

      {/* ================= SEO CONTENT ================= */}
      {categorySEO?.seo_content && (
        <section
          className="mb-12 max-w-3xl prose text-gray-700"
          dangerouslySetInnerHTML={{
            __html: categorySEO.seo_content,
          }}
        />
      )}

      {/* ================= SILO NAV ================= */}
      {category && relatedCategories.length > 0 && (
        <section className="mt-14 border-t pt-10">
          <h2 className="text-lg font-semibold mb-4">
            Jelajahi Kategori Lainnya
          </h2>

          <ul className="flex flex-wrap gap-3">
            {relatedCategories.map((cat) => (
              <li key={cat.slug}>
                <a
                  href={`/produk?category=${cat.slug}`}
                  className="inline-block px-4 py-2 rounded-full border text-sm hover:bg-gray-100"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ================= PRODUCT GRID ================= */}
      {data.items.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          Produk belum tersedia
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data.totalPages} />

      {/* ================= FAQ SCHEMA ================= */}
      {categorySEO?.faq_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: JSON.parse(categorySEO.faq_json).map(
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
