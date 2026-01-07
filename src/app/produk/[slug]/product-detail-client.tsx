"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Store,
  ShoppingBag,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/app/context/CartContext";
import { cloudinaryImage } from "@/lib/cloudinary";
import ProductCard from "@/components/ProductCard";
import StickyAddToCart from "@/components/StickyAddToCart";

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const [related, setRelated] = useState<Product[]>([]);
  const [variations, setVariations] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ================= VARIANT TERPILIH ================= */
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product.variants?.length) return null;
    if (!product.variations?.length) return null;

    // 🔒 VARIASI BELUM LENGKAP → JANGAN MATCH VARIANT
    if (Object.keys(variations).length < product.variations.length) {
      return null;
    }

    return (
      product.variants.find((v) =>
        Object.entries(variations).every(
          ([k, val]) => v.optionMap?.[k] === val
        )
      ) ?? null
    );
  }, [product.variants, product.variations, variations]);

  /* ================= IMAGE ================= */
  const displayImage =
    selectedVariant?.image || product.image || "/placeholder.png";

  const allImages = useMemo(
    () =>
      Array.from(
        new Set([displayImage, ...(product.gallery || [])].filter(Boolean))
      ),
    [displayImage, product.gallery]
  );

  useEffect(() => {
    if (!selectedVariant?.image) return;
    const idx = allImages.findIndex((img) => img === selectedVariant.image);
    if (idx !== -1) setActiveIndex(idx);
  }, [selectedVariant, allImages]);

  /* ================= PRICE ================= */
  const activePrice = selectedVariant
    ? selectedVariant.discountPrice ?? selectedVariant.price
    : product.discountPrice ?? product.price;

  /* ================= WEIGHT (ANTI 0, ANTI UNDEFINED) ================= */
  const activeWeight = useMemo<number>(() => {
    if (
      selectedVariant &&
      typeof selectedVariant.weight === "number" &&
      selectedVariant.weight > 0
    ) {
      return selectedVariant.weight;
    }

    if (
      typeof product.weight === "number" &&
      product.weight > 0
    ) {
      return product.weight;
    }

    return 0;
  }, [selectedVariant, product.weight]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        // ❗ JANGAN SAMPAI product.weight JADI 0
        weight:
          selectedVariant && selectedVariant.weight && selectedVariant.weight > 0
            ? selectedVariant.weight
            : product.weight ?? 0,
      },
      1,
      variations
    );

    toast.success("Ditambahkan ke keranjang 🛒");
    router.push("/keranjang");
  };

  /* ================= RELATED ================= */
  useEffect(() => {
    if (!product.category) return;

    fetch(
      `/api/products/related?category=${product.category}&exclude=${product.id}`
    )
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setRelated(d))
      .catch(console.error);
  }, [product]);

  /* ================= IMAGE NAV ================= */
  const prevImage = () =>
    setActiveIndex((p) => (p > 0 ? p - 1 : allImages.length - 1));
  const nextImage = () =>
    setActiveIndex((p) => (p < allImages.length - 1 ? p + 1 : 0));

  const formattedDesc = product.description
    ? product.description.replace(/\n/g, "<br />")
    : "<i>Tidak ada deskripsi produk.</i>";

  /* ================= RENDER ================= */
  return (
    <section className="py-8 px-4 bg-[#fffafc] min-h-screen space-y-12 pb-24 sm:pb-0">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md overflow-hidden border border-pink-100">
        <div className="px-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali Belanja
          </Link>
        </div>

        {/* IMAGE */}
        <div
          className="relative w-full aspect-square overflow-hidden mt-4"
          onTouchStart={(e) =>
            (touchStartX.current = e.changedTouches[0].screenX)
          }
          onTouchEnd={(e) => {
            touchEndX.current = e.changedTouches[0].screenX;
            if (touchStartX.current - touchEndX.current > 50) nextImage();
            if (touchEndX.current - touchStartX.current > 50) prevImage();
          }}
        >
          <Image
            src={cloudinaryImage(allImages[activeIndex], 1000)}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* THUMB */}
        <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-pink-50/40">
          {allImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 ${
                activeIndex === i
                  ? "border-pink-500"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={cloudinaryImage(img, 300)}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-pink-500 font-semibold text-lg">
            Rp {activePrice.toLocaleString("id-ID")}
          </p>

          <p className="text-xs text-gray-500">
            Berat: {activeWeight} gr
          </p>

          {/* VARIATIONS */}
          {product.variations?.map((v) => (
            <div key={v.name}>
              <p className="font-medium mb-1">{v.name}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setVariations((p) => ({ ...p, [v.name]: opt }))
                    }
                    className={`px-3 py-1 rounded-full border text-sm ${
                      variations[v.name] === opt
                        ? "bg-pink-500 text-white border-pink-500"
                        : "border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* DESC */}
          <div>
            <h2 className="font-semibold text-pink-500 mb-2">
              Deskripsi Produk
            </h2>
            <div
              className={`text-sm leading-relaxed ${
                !showFullDesc ? "line-clamp-6" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: formattedDesc }}
            />
            <button
              onClick={() => setShowFullDesc((p) => !p)}
              className="text-pink-500 text-sm mt-2"
            >
              {showFullDesc ? "Sembunyikan" : "Lihat Selengkapnya"}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart /> Masuk Keranjang
          </button>

          {/* MARKETPLACE */}
          <div className="flex gap-2">
            {product.marketplace?.shopee && (
              <a
                href={product.marketplace.shopee}
                target="_blank"
                className="flex-1 bg-orange-400 text-white py-2 rounded-xl flex justify-center gap-1"
              >
                <Store /> Shopee
              </a>
            )}
            {product.marketplace?.tokopedia && (
              <a
                href={product.marketplace.tokopedia}
                target="_blank"
                className="flex-1 bg-green-500 text-white py-2 rounded-xl flex justify-center gap-1"
              >
                <ShoppingBag /> Tokopedia
              </a>
            )}
            {product.marketplace?.tiktok && (
              <a
                href={product.marketplace.tiktok}
                target="_blank"
                className="flex-1 bg-black text-white py-2 rounded-xl flex justify-center gap-1"
              >
                <PlayCircle /> TikTok
              </a>
            )}
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="max-w-6xl mx-auto px-2">
        <h2 className="font-semibold mb-4">Produk Terkait</h2>
        {related.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada produk terkait
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* STICKY */}
      <StickyAddToCart
        price={activePrice}
        onAdd={handleAddToCart}
        disabled={
          product.variations?.length
            ? Object.keys(variations).length <
              product.variations.length
            : false
        }
      />
    </section>
  );
}
