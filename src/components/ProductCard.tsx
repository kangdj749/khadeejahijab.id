"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { useCart } from "@/app/context/CartContext";
import { cloudinaryImage } from "@/lib/cloudinary";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const imageUrl = product.image
    ? cloudinaryImage(product.image, 600)
    : "/placeholder.png";

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, {});
    toast.success("Ditambahkan ke keranjang 🛍️");
  };

  return (
    <article
      className="
        group relative
        bg-card border border-border
        rounded-2xl overflow-hidden
        shadow-card hover:shadow-soft
        transition
      "
    >
      <Link href={`/produk/${product.slug}`} className="block">
        {/* CATEGORY BADGE */}
        {product.category && (
          <span
            className="
              absolute top-3 left-3 z-10
              bg-primary/90 text-primary-foreground
              text-[11px] font-semibold
              px-2 py-1 rounded-md
              shadow
            "
          >
            {product.category}
          </span>
        )}

        {/* IMAGE */}
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="
              object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-3 space-y-1">
          <h3 className="text-sm sm:text-base font-semibold text-primary line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <p className="text-primary font-bold text-sm sm:text-base">
                  Rp{" "}
                  {Number(product.discountPrice).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-foreground/50 line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </>
            ) : (
              <p className="text-primary font-bold text-sm sm:text-base">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* ADD TO CART */}
      <button
        onClick={handleAddToCart}
        aria-label={`Tambah ${product.name} ke keranjang`}
        className="
          absolute bottom-3 right-3 z-20
          bg-primary text-primary-foreground
          p-2.5 rounded-full
          shadow-lg
          hover:bg-primary/90
          transition
        "
      >
        <ShoppingCart className="h-5 w-5" />
      </button>
    </article>
  );
}
