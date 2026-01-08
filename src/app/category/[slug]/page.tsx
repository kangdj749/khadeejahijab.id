import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import SearchBarClient from "@/components/SearchBarClient";
import CategoryTabsClient from "@/components/CategoryTabsClient";
import Pagination from "@/components/Pagination";
import { getProducts } from "@/lib/sheets/products";
import { slugify } from "@/lib/slugify";
import { paginate } from "@/lib/paginate";

const LIMIT = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string; page?: string };
}) {
  const keyword = (searchParams.q || "").toLowerCase();
  const page = Number(searchParams.page || 1);

  const products: Product[] = await getProducts();

  const categoryName = products.find(
    (p) => slugify(p.category || "") === params.slug
  )?.category;

  if (!categoryName) {
    return <div className="py-20 text-center">Kategori tidak ditemukan</div>;
  }

  /** FILTER */
  const filtered = products.filter((p) => {
    const matchCategory = p.category === categoryName;
    const matchSearch =
      !keyword ||
      p.name.toLowerCase().includes(keyword) ||
      p.tags?.some((t) => t.toLowerCase().includes(keyword));

    return matchCategory && matchSearch;
  });

  /** PAGINATION */
  const pagination = paginate(filtered, page, LIMIT);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">{categoryName}</h1>

      <SearchBarClient defaultValue={keyword} />
      <CategoryTabsClient
        categories={categories}
        active={categoryName}
      />

      {pagination.data.length === 0 ? (
        <p className="py-20 text-center text-gray-500">
          Produk tidak ditemukan
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pagination.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        </>
      )}
    </main>
  );
}
