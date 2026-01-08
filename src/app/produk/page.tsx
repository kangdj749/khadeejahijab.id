import { headers } from "next/headers";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Product } from "@/types";

type ProdukPageProps = {
  searchParams: {
    page?: string;
    category?: string;
  };
};

export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const page = Number(searchParams.page ?? "1");
  const limit = 12;
  const category = searchParams.category ?? "";

  // ✅ AMBIL HOST (localhost / domain production)
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/products?page=${page}&limit=${limit}${
    category ? `&category=${encodeURIComponent(category)}` : ""
  }`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Gagal mengambil produk");
  }

  const data: {
    items: Product[];
    totalPages: number;
  } = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Semua Produk
        </h1>
        {category && (
          <p className="text-sm text-gray-500 mt-1">
            Kategori: {category}
          </p>
        )}
      </header>

      {data.items.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          Produk belum tersedia
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data.totalPages} />
    </main>
  );
}
