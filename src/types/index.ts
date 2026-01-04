// src/types/index.ts

export type ProductVariation = {
  name: string;
  options: string[];
};

export type ProductVariant = {
  id: string;
  optionMap: Record<string, string>;
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
  weight?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  gallery: string[];
  price: number;
  discountPrice?: number;
  category?: string;
  tags?: string[];
  variations?: ProductVariation[];
  variants?: ProductVariant[];
  marketplace?: {
    shopee?: string;
    tokopedia?: string;
    tiktok?: string;
  };
  weight: number;
};
