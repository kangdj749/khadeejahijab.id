"use client";

import { useEffect, useState } from "react";
import { useCart, CartItem } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import type { Product } from "@/types";
import { cloudinaryImage } from "@/lib/cloudinary";

type EditingItem = { index: number; item: CartItem };

export default function CartPage() {
  const { items, updateQty, removeItem, updateItemVariation, addItem } = useCart();
  const router = useRouter();

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [tempVariations, setTempVariations] = useState<Record<string, string>>({});
  const [related, setRelated] = useState<Product[]>([]);

  const findVariant = (product: Product, selected?: Record<string, string>) =>
    product.variants?.find((v) =>
      Object.entries(selected || {}).every(([k, val]) => v.optionMap[k] === val)
    );

  const getVariantPrice = (item: CartItem) =>
    findVariant(item.product, item.selectedVariations)?.discountPrice ??
    findVariant(item.product, item.selectedVariations)?.price ??
    item.product.discountPrice ??
    item.product.price;

  const getVariantWeight = (item: CartItem) =>
    findVariant(item.product, item.selectedVariations)?.weight ?? item.product.weight ?? 0;

  const getVariantImage = (item: CartItem) =>
    findVariant(item.product, item.selectedVariations)?.image ?? item.product.image ?? "/placeholder.png";

  const subtotal = items.reduce((sum, i) => sum + getVariantPrice(i) * i.qty, 0);
  const totalWeight = items.reduce((sum, i) => sum + getVariantWeight(i) * i.qty, 0);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch("/api/products?related=true");
        const data = await res.json();
        if (Array.isArray(data)) setRelated(data as Product[]);
      } catch {}
    };
    fetchRelated();
  }, []);

  const handleCheckout = () => {
    const checkoutItems = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      image: getVariantImage(i),
      variations: i.selectedVariations ?? {},
      qty: i.qty,
      price: getVariantPrice(i),
      weight: getVariantWeight(i),
      totalPrice: getVariantPrice(i) * i.qty,
    }));
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ items: checkoutItems, subtotal, totalWeight })
    );
    router.push("/checkout");
  };

  if (items.length === 0)
    return (
      <section className="flex flex-col items-center justify-center min-h-screen p-6 bg-pink-50 text-center">
        <Image src="/empty-cart.svg" alt="Empty Cart" width={200} height={200} className="mb-4" />
        <p className="text-gray-600 text-lg">Keranjang kamu masih kosong 😢</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
        >
          Belanja Sekarang
        </button>
      </section>
    );

  return (
    <section className="bg-pink-50 min-h-screen flex flex-col lg:flex-row lg:justify-center lg:items-start lg:gap-6 py-8 px-4 pb-32 sm:pb-0">
      {/* ================= LEFT: Cart Items ================= */}
      <div className="w-full max-w-md lg:max-w-lg bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-pink-700 text-center">Keranjang Belanja</h1>

          {/* List Item */}
          <div className="divide-y divide-pink-100">
            {items.map((item, index) => {
              const variationText = item.selectedVariations
                ? Object.entries(item.selectedVariations)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : null;

              return (
                <div key={`${item.product.id}-${index}`} className="flex items-center gap-4 py-5">
                  <div className="relative w-24 aspect-square flex-shrink-0 rounded-xl overflow-hidden border bg-pink-50">
                    <Image
                      src={cloudinaryImage(getVariantImage(item), 300)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.product.name}</p>
                    {variationText && <p className="text-sm text-gray-500 truncate">{variationText}</p>}
                    <p className="text-pink-700 font-semibold mt-1">
                      Rp {getVariantPrice(item).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-400">Berat: {getVariantWeight(item)} gr</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        disabled={item.qty <= 1}
                        onClick={() =>
                          updateQty(item.product.id, item.qty - 1, item.selectedVariations)
                        }
                        className="p-1 border rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() =>
                          updateQty(item.product.id, item.qty + 1, item.selectedVariations)
                        }
                        className="p-1 border rounded"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="ml-auto p-1 border rounded"
                        onClick={() => removeItem(item.product.id, item.selectedVariations)}
                      >
                        <Trash2 size={16} />
                      </button>
                      {item.product.variations?.length && (
                        <button
                          onClick={() => {
                            setEditingItem({ index, item });
                            setTempVariations(item.selectedVariations ?? {});
                          }}
                          className="ml-2 px-2 py-1 bg-pink-100 rounded text-pink-700 text-xs"
                        >
                          Edit Variasi
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal & total berat */}
          <div className="flex justify-between pt-4 border-t">
            <span>Subtotal</span>
            <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <p className="text-xs text-gray-500 text-right">Total berat: {totalWeight.toLocaleString("id-ID")} gr</p>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex flex-col gap-2 mt-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition"
            >
              Lanjut ke Checkout
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-pink-100 text-pink-700 py-3 rounded-xl"
            >
              Kembali Belanja
            </button>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-pink-700 mb-3">Produk Terkait</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {related.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded-xl overflow-hidden cursor-pointer flex flex-col"
                    onClick={() => addItem(p, 1)}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={cloudinaryImage(p.image, 300)}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-800 p-2 truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT: Sticky Sidebar (Desktop) ================= */}
      {items.length > 0 && (
        <div className="hidden lg:flex flex-col w-80 sticky top-20 h-fit gap-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h3 className="font-semibold text-pink-700 text-lg">Ringkasan Belanja</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-pink-700">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <p className="text-xs text-gray-500">Total berat: {totalWeight.toLocaleString("id-ID")} gr</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition"
            >
              Checkout
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-pink-100 text-pink-700 py-3 rounded-xl"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      )}

      {/* ================= Sticky Checkout Bar Mobile ================= */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-pink-200 p-4 flex justify-between items-center shadow-md lg:hidden z-50">
          <div>
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="font-semibold text-pink-700 text-lg">
              Rp {subtotal.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-pink-700 transition"
          >
            Checkout
          </button>
        </div>
      )}

      {/* Modal Edit Variasi */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-pink-700">Edit Variasi</h3>
              <button onClick={() => setEditingItem(null)}>
                <X />
              </button>
            </div>
            {editingItem.item.product.variations?.map((v) => (
              <div key={v.name} className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">{v.name}</p>
                <div className="flex flex-wrap gap-2">
                  {v.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setTempVariations((prev) => ({ ...prev, [v.name]: opt }))
                      }
                      className={`px-3 py-1 rounded-full border text-sm ${
                        tempVariations[v.name] === opt
                          ? "bg-pink-600 text-white border-pink-600"
                          : "border-gray-300 text-gray-700 hover:border-pink-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                if (editingItem) {
                  updateItemVariation(
                    editingItem.item.product.id,
                    editingItem.item.selectedVariations,
                    tempVariations
                  );
                  setEditingItem(null);
                }
              }}
              className="mt-4 w-full bg-pink-600 text-white font-semibold py-2 rounded-xl hover:bg-pink-700 transition"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
