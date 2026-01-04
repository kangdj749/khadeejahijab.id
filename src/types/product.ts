// src/types.ts

export type ProductVariation = {
  /** Nama variasi di UI, contoh: "Warna" */
  name: string;
  /** Daftar opsi, contoh: ["Merah", "Hitam", "Putih"] */
  options: string[];
};

export type ProductVariant = {
  /** ID unik setiap kombinasi variasi */
  id: string;
  /** Peta variasi, contoh: { Warna: "Merah", Ukuran: "L" } */
  optionMap: Record<string, string>;
  /** Harga asli kombinasi ini */
  price: number;
  /** Harga diskon (jika ada) */
  discountPrice?: number;
  /** Stok tersedia */
  stock: number;
  /** Berat spesifik varian (opsional, override product.weight) */
  weight?: number;
  /** Gambar spesifik kombinasi (opsional) */
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;

  /** cloudinary publicId */
  image: string;
  /** cloudinary publicId[] */
  gallery: string[];

  price: number;
  discountPrice?: number;

  /** Berat default produk (gram) */
  weight?: number;

  category?: string;
  tags?: string[];

  /** Untuk UI pilih variasi */
  variations?: ProductVariation[];

  /** Untuk lookup harga / stok / gambar */
  variants?: ProductVariant[];

  marketplace?: {
    shopee?: string;
    tokopedia?: string;
    tiktok?: string;
  };
};
