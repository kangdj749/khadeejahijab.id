"use client";

import Image from "next/image";
import type { CheckoutItem } from "@/types/checkout";

interface Props {
  items: CheckoutItem[];
  subtotal: number;
  ongkir: number;
  total: number;
}

export default function CheckoutSummary({
  items,
  subtotal,
  ongkir,
  total,
}: Props) {
  const safeItems = items.map((i) => ({
    ...i,
    qty: Number(i.qty ?? 0),
    weight: Number(i.weight ?? 0),
    price: Number(i.price ?? 0),
    image: i.image ?? "/placeholder.png",
  }));

  const totalWeight = safeItems.reduce((sum, i) => sum + i.weight * i.qty, 0);

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
      <h3 className="font-semibold">Ringkasan Pesanan</h3>

      <div className="space-y-4">
        {safeItems.map((item, idx) => {
          const variantText = item.variations
            ? Object.entries(item.variations)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")
            : null;

          return (
            <div key={idx} className="flex gap-3 items-start">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-pink-50 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight truncate">{item.name}</p>
                {variantText && <p className="text-xs text-gray-500 mt-0.5">{variantText}</p>}
                <p className="text-xs text-gray-400 mt-1">{item.qty} × Rp {item.price.toLocaleString("id-ID")}</p>
              </div>

              <div className="font-semibold text-sm text-pink-700">
                Rp {(item.price * item.qty).toLocaleString("id-ID")}
              </div>
            </div>
          );
        })}
      </div>

      <hr />

      <div className="flex justify-between text-sm">
        <span>Total Berat</span>
        <span>{(totalWeight / 1000).toFixed(2)} kg</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Ongkir</span>
        <span>{ongkir ? `Rp ${ongkir.toLocaleString("id-ID")}` : "-"}</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-pink-600 text-base">
        <span>Total Bayar</span>
        <span>Rp {total.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}
