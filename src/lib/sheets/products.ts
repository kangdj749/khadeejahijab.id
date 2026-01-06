// lib/sheets/products.ts
import { Product, ProductVariation, ProductVariant } from "@/types";

/* ===============================
   SHEET CONFIG
================================ */
const SHEET_ID = "1UvyWlzfZKglochDV8_uqb6b8huZBWGvzv5ExjY7C9P8";
const TAB_PRODUCTS = "products";
const TAB_VARIATIONS = "product_variations";

/* ===============================
   SHEET ROW TYPES
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
  weight?: string | number;
  [key: string]: unknown;
};

/* ===============================
   HELPERS
================================ */
const capitalize = (str: string) =>
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
   GET ALL PRODUCTS (NO PAGINATION)
================================ */
export async function getProducts(): Promise<Product[]> {
  try {
    const [resProducts, resVariations] = await Promise.all([
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/${TAB_PRODUCTS}`, {
        cache: "no-store",
      }),
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/${TAB_VARIATIONS}`, {
        cache: "no-store",
      }),
    ]);

    if (!resProducts.ok) return [];

    const productsSheet: SheetProductRow[] = await resProducts.json();
    const variationsSheet: SheetVariationRow[] =
      resVariations.ok ? await resVariations.json() : [];

    if (!Array.isArray(productsSheet)) return [];

    /* =============================
       VARIANTS
    ============================== */
    const variantsByProduct: Record<string, ProductVariant[]> = {};
    const uiOptions: Record<string, Record<string, Set<string>>> = {};

    variationsSheet.forEach((row) => {
      const productId = row.productId?.toString().trim();
      if (!productId) return;

      const names: string[] = [];
      const values: string[][] = [];

      for (let i = 1; i <= 5; i++) {
        const n = row[`variation${i}Name`];
        const v = row[`variation${i}Value`];

        if (typeof n === "string" && typeof v === "string") {
          const opts = v.split(",").map((s) => s.trim()).filter(Boolean);
          if (!opts.length) continue;

          names.push(n);
          values.push(opts);

          uiOptions[productId] ??= {};
          uiOptions[productId][n] ??= new Set();
          opts.forEach((o) => uiOptions[productId][n].add(o));
        }
      }

      const combos = names.length ? cartesianProduct(values) : [[]];

      combos.forEach((combo, idx) => {
        const optionMap: Record<string, string> = {};
        names.forEach((n, i) => (optionMap[capitalize(n)] = combo[i]));

        variantsByProduct[productId] ??= [];
        variantsByProduct[productId].push({
          id: `${productId}-${idx}`,
          optionMap,
          price: Number(row.price) || 0,
          discountPrice: row.discountPrice
            ? Number(row.discountPrice)
            : undefined,
          stock: Number(row.stock) || 0,
          image:
            typeof row.image === "string" && row.image.startsWith("http")
              ? row.image
              : undefined,
          weight: Number(row.weight) || 0,
        });
      });
    });

    const uiVariations: Record<string, ProductVariation[]> = {};
    Object.entries(uiOptions).forEach(([pid, groups]) => {
      uiVariations[pid] = Object.entries(groups).map(([name, set]) => ({
        name: capitalize(name),
        options: Array.from(set),
      }));
    });

    /* =============================
       FINAL MAP
    ============================== */
    return productsSheet.map((item, idx) => {
      const id = item.id?.toString().trim() || `product-${idx}`;

      const gallery =
        typeof item.gallery === "string"
          ? item.gallery.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

      const variantImgs =
        variantsByProduct[id]
          ?.map((v) => v.image)
          .filter((i): i is string => typeof i === "string") || [];

      const mergedGallery = Array.from(
        new Set([...gallery, ...variantImgs])
      );

      return {
        id,
        name: item.name || "Produk",
        slug: item.slug || (item.name ? slugify(item.name) : id),
        description: item.description || "",
        image:
          typeof item.image === "string" && item.image.startsWith("http")
            ? item.image
            : mergedGallery[0] || "/placeholder.png",
        gallery: mergedGallery,
        price: Number(item.price) || 0,
        discountPrice: item.discountPrice
          ? Number(item.discountPrice)
          : undefined,
        category: item.category || "",
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
    console.error("❌ getProducts error:", err);
    return [];
  }
}

/* ===============================
   HELPERS
================================ */
export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string) {
  const all = await getProducts();
  return all.find((p) => p.id === id) || null;
}

export async function getRelatedProducts(
  category: string,
  excludeId?: string,
  limit = 4
) {
  const all = await getProducts();
  return all
    .filter(
      (p) => p.category === category && (!excludeId || p.id !== excludeId)
    )
    .slice(0, limit);
}
