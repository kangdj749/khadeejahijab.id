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
  /** RAW QUERY */
  const rawKeyword = searchParams.q || "";
  const rawCategory = searchParams.category || "all";

  /** NORMALIZED */
  const keyword = rawKeyword.trim().toLowerCase();
  const activeCategory = rawCategory.trim().toLowerCase();

  const products: Product[] = await getProducts();

  /** FILTER */
  const filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const tags = Array.isArray(p.tags)
      ? p.tags.map((t) => t.toLowerCase())
      : [];

    const matchKeyword =
      !keyword ||
      name.includes(keyword) ||
      tags.some((t) => t.includes(keyword));

    const matchCategory =
      activeCategory === "all" || category === activeCategory;

    return matchKeyword && matchCategory;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    // 🔥 INI KUNCI NYA
    <main
      key={`${rawKeyword}-${rawCategory}`}
      className="max-w-6xl mx-auto px-4 py-10 space-y-8"
    >
      <h1 className="text-2xl font-bold">
        Hasil pencarian {rawKeyword && `“${rawKeyword}”`}
      </h1>

      <SearchBarClient defaultValue={rawKeyword} />

      <CategoryTabsClient
        categories={categories}
        active={rawCategory}
      />

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
