"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Store,
  ShoppingBag,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Product, ProductVariant } from "@/types";
import { useCart } from "@/app/context/CartContext";
import { cloudinaryImage } from "@/lib/cloudinary";
import { getRelatedProducts } from "@/lib/sheets/products";

type Props = {
  product: Product;
};




export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const [related, setRelated] = useState<Product[]>([]);
  const [variations, setVariations] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ================= INIT ================= */
  useEffect(() => {
  let mounted = true;

  if (product?.category) {
    getRelatedProducts(product.category, product.id)
      .then((res) => {
        if (mounted) setRelated(res);
      })
      .catch(console.error);
  }

  return () => {
    mounted = false;
  };
}, [product?.category, product?.id]);

  
  /* ================= VARIANT ================= */
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    if (!Object.keys(variations).length) return null;

    return (
        product.variants.find((v: ProductVariant) =>
        Object.entries(variations).every(
            ([k, val]) => v.optionMap[k] === val
        )
        ) || null
    );
    }, [product, variations]);


  /* ================= IMAGES ================= */
  const displayImage =
    selectedVariant?.image || product.image || "/placeholder.png";

  const allImages = useMemo<string[]>(() => {
    const base = [displayImage, ...(product.gallery || [])];
    return Array.from(new Set(base.filter(Boolean)));
  }, [displayImage, product.gallery]);

  /* ================= CART ================= */
  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        price: selectedVariant?.price ?? product.price,
        discountPrice:
          selectedVariant?.discountPrice ?? product.discountPrice,
      },
      1,
      variations
    );

    toast.success("Ditambahkan ke keranjang 🛒");
    router.push("/keranjang");
  };

  /* ================= GESTURE ================= */
  const prevImage = () =>
    setActiveIndex((p) => (p > 0 ? p - 1 : allImages.length - 1));
  const nextImage = () =>
    setActiveIndex((p) => (p < allImages.length - 1 ? p + 1 : 0));

  /* ================= DESC ================= */
  const formattedDesc = product.description
    ? product.description.replace(/\n/g, "<br />")
    : "<i>Tidak ada deskripsi produk.</i>";

useEffect(() => {
    if (!selectedVariant?.image) return;

    const idx = allImages.findIndex(
        (img) => img === selectedVariant.image
    );

    if (idx !== -1) {
        setActiveIndex(idx);
    }
    }, [selectedVariant, allImages]);

  /* ================= UI ================= */
  return (
    <section className="py-8 px-4 bg-[#fffafc] min-h-screen space-y-10 font-[Poppins]">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md overflow-hidden border border-pink-100">

        {/* IMAGE UTAMA */}
        <div
          className="relative w-full aspect-square rounded-3xl overflow-hidden group"
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
            sizes="100vw"
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

        {/* ✅ GALLERY — FIXED */}
        <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-pink-50/40">
          {allImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 aspect-square flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                activeIndex === i
                  ? "border-pink-500"
                  : "border-gray-200 hover:border-pink-400"
              }`}
            >
              <Image
                src={cloudinaryImage(img, 300)}
                alt={`${product.name}-${i}`}
                fill
                sizes="80px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* INFO */}
        <div className="p-6 space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-pink-500 font-semibold text-lg">
            Rp{" "}
            {(selectedVariant?.price ?? product.price).toLocaleString(
              "id-ID"
            )}
          </p>

          {/* VARIASI */}
          {product.variations?.map((v) => (
            <div key={v.name}>
              <p className="font-medium mb-1">{v.name}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setVariations((p) => ({
                        ...p,
                        [v.name]: opt,
                      }))
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

          {/* CART */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
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
    </section>


  );
}

