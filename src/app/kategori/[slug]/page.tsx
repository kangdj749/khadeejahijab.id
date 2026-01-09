import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

type Props = {
  params: { slug: string };
};

async function getProductsByCategory(slug: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

/* ================= SEO META ================= */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const categoryName = params.slug.replace(/-/g, " ");

  return {
    title: `Jual ${categoryName} Terbaik & Terbaru`,
    description: `Temukan koleksi ${categoryName} berkualitas, harga terbaik, dan siap kirim ke seluruh Indonesia.`,
    openGraph: {
      title: `Produk ${categoryName}`,
      description: `Koleksi ${categoryName} pilihan terbaik`,
      type: "website",
    },
    
  };
}

/* ================= PAGE ================= */
export default async function CategoryPage({ params }: Props) {
  const products = await getProductsByCategory(params.slug);

  if (!products.length) return notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 capitalize">
        Kategori: {params.slug.replace(/-/g, " ")}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
