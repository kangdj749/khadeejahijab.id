// lib/sheets/products.ts
import { Product, ProductVariation, ProductVariant } from "@/types";

/* ===============================
   SHEET CONFIG
================================ */
const SHEET_ID = "1UvyWlzfZKglochDV8_uqb6b8huZBWGvzv5ExjY7C9P8";
const TAB_PRODUCTS = "products";
const TAB_VARIATIONS = "product_variations";

/* ===============================
   SHEET ROW TYPES (ANTI any)
================================ */
type SheetProductRow = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  gallery?: string;
  price?: string | number;
  discountPrice?: string | number;
  category?: string;
  tags?: string;
  shopee?: string;
  tokopedia?: string;
  tiktok?: string;
  weight?: string | number;
};

type SheetVariationRow = {
  productId?: string;
  price?: string | number;
  discountPrice?: string | number;
  stock?: string | number;
  image?: string;
  [key: string]: unknown; // variation1Name, variation1Value, dst
};

/* ===============================
   HELPERS
================================ */
const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

function cartesianProduct(arrays: string[][]): string[][] {
  if (!arrays.length) return [[]];
  return arrays.reduce<string[][]>(
    (acc, arr) => acc.flatMap((a) => arr.map((b) => [...a, b])),
    [[]]
  );
}

/* ================================
   GET PRODUCTS (PAGINATION READY)
================================ */
export async function getProducts(
  page = 1,
  limit = 8
): Promise<Product[]> {
  try {
    const [resProducts, resVariations] = await Promise.all([
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/${TAB_PRODUCTS}`, {
        next: { revalidate: 3600 }, // cache 1 jam,
      }),
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/${TAB_VARIATIONS}`, {
        next: { revalidate: 3600 }, // cache 1 jam,
      }),
    ]);

    if (!resProducts.ok) {
      console.error("❌ Produk sheet gagal di-fetch");
      return [];
    }

    const dataProducts: SheetProductRow[] =
      await resProducts.json();

    const dataVariations: SheetVariationRow[] =
      resVariations.ok ? await resVariations.json() : [];

    if (!Array.isArray(dataProducts)) return [];

    /* =============================
       VARIATION PROCESSING
    ============================== */
    const variantsByProduct: Record<string, ProductVariant[]> = {};
    const uiOptionsByProduct: Record<
      string,
      Record<string, Set<string>>
    > = {};

    dataVariations.forEach((row) => {
      const productId = row?.productId?.toString().trim();
      if (!productId) return;

      const names: string[] = [];
      const optionArrays: string[][] = [];

      for (let i = 1; i <= 5; i++) {
        const n = row[`variation${i}Name`];
        const v = row[`variation${i}Value`];

        if (typeof n === "string" && typeof v === "string") {
          const opts = v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          if (opts.length) {
            names.push(n);
            optionArrays.push(opts);

            uiOptionsByProduct[productId] ??= {};
            uiOptionsByProduct[productId][n] ??= new Set();
            opts.forEach((o) =>
              uiOptionsByProduct[productId][n].add(o)
            );
          }
        }
      }

      const price = Number(row.price) || 0;
      const discountPrice = row.discountPrice
        ? Number(row.discountPrice)
        : undefined;
      const stock = Number(row.stock) || 0;
      const image =
        typeof row.image === "string" && row.image.startsWith("http")
          ? row.image
          : undefined;

      const combos = names.length
        ? cartesianProduct(optionArrays)
        : [[]];

      combos.forEach((combo, idx) => {
        const optionMap: Record<string, string> = {};
        names.forEach(
          (n, i) => (optionMap[capitalize(n)] = combo[i])
        );

        variantsByProduct[productId] ??= [];
        variantsByProduct[productId].push({
          id: `${productId}-${idx}`,
          optionMap,
          price,
          discountPrice,
          stock,
          image,
          weight: Number(row.weight) || undefined,
        });
      });
    });

    /* =============================
       BUILD UI VARIATIONS
    ============================== */
    const uiVariations: Record<string, ProductVariation[]> = {};
    Object.entries(uiOptionsByProduct).forEach(([pid, groups]) => {
      uiVariations[pid] = Object.entries(groups).map(
        ([name, set]) => ({
          name: capitalize(name),
          options: Array.from(set),
        })
      );
    });

    /* =============================
       PAGINATION
    ============================== */
    const start = (page - 1) * limit;
    const sliced = dataProducts.slice(start, start + limit);

    /* =============================
       FINAL MAP (SLUG FIXED)
    ============================== */
    return sliced.map((item, idx) => {
      const id =
        item?.id?.toString().trim() || `product-${start + idx}`;

      const gallery =
        typeof item.gallery === "string"
          ? item.gallery
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

      const variantImgs: string[] =
      variantsByProduct[id]
        ?.map((v) => v.image)
        .filter((img): img is string => typeof img === "string") || [];

      const mergedGallery: string[] = Array.from(
        new Set([...gallery, ...variantImgs])
      );

      return {
        id,
        name: item?.name?.toString() || "Produk",
        slug:
          item.slug?.toString().trim() ||
          (item.name ? slugify(item.name) : id),
        description: item?.description?.toString() || "",
        image:
          typeof item.image === "string" && item.image.startsWith("http")
            ? item.image
            : mergedGallery[0] || "/placeholder.png",
        gallery: mergedGallery,
        price: Number(item.price) || 0,
        discountPrice: item.discountPrice
          ? Number(item.discountPrice)
          : undefined,
        category: item?.category?.toString() || "",
        tags:
          typeof item.tags === "string"
            ? item.tags.split(",").map((t) => t.trim())
            : [],
        variations: uiVariations[id] || [],
        variants: variantsByProduct[id] || [],
        marketplace: {
          shopee: item.shopee || undefined,
          tokopedia: item.tokopedia || undefined,
          tiktok: item.tiktok || undefined,
        },
        weight: Number(item.weight) || 0,
      };
    });
  } catch (err) {
    console.error("❌ Error getProducts:", err);
    return [];
  }
}

/* ===============================
   GET PRODUCT BY SLUG
================================ */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const products = await getProducts(1, 9999);
  return products.find((p) => p.slug === slug) ?? null;
}

/* ===============================
   GET PRODUCT BY ID (LEGACY)
================================ */
export async function getProductById(id: string) {
  const all = await getProducts(1, 9999);
  return all.find((p) => p.id === id) || null;
}

/* ===============================
   RELATED PRODUCTS
================================ */
export async function getRelatedProducts(
  category: string,
  excludeId?: string,
  limit = 4
) {
  if (!category) return [];

  const all = await getProducts(1, 9999);

  return all
    .filter(
      (p) =>
        p.category === category &&
        (!excludeId || p.id !== excludeId)
    )
    .slice(0, limit);
}
