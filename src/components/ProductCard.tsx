"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cloudinaryImage } from "@/lib/cloudinary";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const productUrl = `/produk/${product.slug}`;

  const imageUrl = product.image
    ? cloudinaryImage(product.image, 600)
    : "/placeholder.png";

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      addItem(product, 1, {});
      toast.success("Ditambahkan ke keranjang 🛍️");
    } catch (err) {
      console.error("addItem error:", err);
      toast.error("Gagal menambahkan ke keranjang 😢");
    }
  };

  return (
    <article className="relative bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition overflow-hidden group">
      <Link
        href={productUrl}
        aria-label={`Lihat detail ${product.name}`}
        className="block focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-2xl"
      >
        {/* CATEGORY */}
        {product.category && (
          <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
            {product.category}
          </span>
        )}

        {/* IMAGE */}
        <div className="relative aspect-square w-full bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="px-3 py-3 space-y-1">
          <h2 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
            {product.name}
          </h2>

          {/* PRICE */}
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <p className="text-rose-500 font-bold text-sm sm:text-base">
                  Rp {Number(product.discountPrice).toLocaleString("id-ID")}
                </p>
                <p className="text-gray-400 text-xs line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </>
            ) : (
              <p className="text-rose-500 font-bold text-sm sm:text-base">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* CART */}
      <div className="absolute bottom-3 right-3 z-20">
        <button
          onClick={handleAddToCart}
          aria-label={`Tambah ${product.name} ke keranjang`}
          className="bg-rose-500 hover:bg-rose-600 p-2.5 rounded-full shadow-md text-white transition-transform hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
