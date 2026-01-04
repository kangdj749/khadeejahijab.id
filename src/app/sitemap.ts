import { MetadataRoute } from "next";
import { getProducts } from "@/lib/sheets/products";
import { CATEGORY_MAP } from "@/lib/category";
import { Product } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://khadeejahijab.id";

  /* ================= CATEGORIES ================= */
  const categories: MetadataRoute.Sitemap = Object.values(CATEGORY_MAP).map(
    (c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  /* ================= PRODUCTS ================= */
  const products: Product[] = await getProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /* ================= STATIC ================= */
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories,
    ...productUrls,
  ];
}
