/* =============================
   TYPES
============================= */
export type CategorySEO = {
  slug: string;
  name: string;
  seo_title?: string;
  seo_description?: string;
  seo_content?: string;
  faq_json?: string;
};

type SheetRow = [
  string, // slug
  string, // name
  string?, // seo_title
  string?, // seo_description
  string?, // seo_content
  string?  // faq_json
];

/* =============================
   FETCH SHEET ROWS
============================= */
async function fetchCategoryRows(): Promise<SheetRow[]> {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
  const API_KEY = process.env.GOOGLE_SHEET_API_KEY!;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/categories_seo?key=${API_KEY}`,
    { next: { revalidate: 3600 } } // cache 1 jam
  );

  if (!res.ok) {
    console.warn("⚠️ categories_seo sheet gagal diambil");
  return [];
  }

  const data = await res.json();

  // baris pertama = header → skip
  return (data.values?.slice(1) || []) as SheetRow[];
}

/* =============================
   SINGLE CATEGORY
============================= */
export async function getCategorySEO(slug: string) {
  const rows = await fetchCategoryRows();

  const row = rows.find((r) => r[0] === slug);
  if (!row) return null;

  return {
    slug: row[0],
    name: row[1],
    seo_title: row[2],
    seo_description: row[3],
    seo_content: row[4],
    faq_json: row[5],
  };
}

/* =============================
   ALL CATEGORIES (SEO SILO)
============================= */
export async function getAllCategorySEO(): Promise<CategorySEO[]> {
  const rows = await fetchCategoryRows();

  return rows
    .filter((row) => row[0] && row[1])
    .map((row) => ({
      slug: row[0],
      name: row[1],
      seo_title: row[2],
      seo_description: row[3],
      seo_content: row[4],
      faq_json: row[5],
    }));
}
