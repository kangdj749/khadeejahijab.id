import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import SearchBarClient from "@/components/SearchBarClient";
import CategoryTabsClient from "@/components/CategoryTabsClient";
import { getProducts } from "@/lib/sheets/products";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

export default async function SearchPage({ searchParams }: Props) {
  const keyword = (searchParams.q || "").toLowerCase();
  const activeCategory = searchParams.category || "all";

  const products: Product[] = await getProducts();

  /** FILTER SERVER */
  const filtered = products.filter((p) => {
    const matchKeyword =
      !keyword ||
      p.name.toLowerCase().includes(keyword) ||
      p.tags?.some((t) => t.toLowerCase().includes(keyword));

    const matchCategory =
      activeCategory === "all" || p.category === activeCategory;

    return matchKeyword && matchCategory;
  });

  /** KATEGORI UNIK */
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">
        Hasil pencarian {keyword && `“${keyword}”`}
      </h1>

      {/* SEARCH INPUT */}
      <SearchBarClient defaultValue={keyword} />

      {/* CATEGORY */}
      <CategoryTabsClient
        categories={categories}
        active={activeCategory}
      />

      {/* RESULT */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          Produk tidak ditemukan
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
