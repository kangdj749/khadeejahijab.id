// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cloudinaryImage } from "@/lib/cloudinary";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutShipping from "@/components/checkout/CheckoutShipping";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutSubmit from "@/components/checkout/CheckoutSubmit";

import { buildWhatsAppMessage } from "@/lib/format-wa";
import type { CourierService } from "@/types/shipping";
import type { CheckoutData } from "@/lib/format-wa";
import type { CheckoutItem } from "@/types/checkout";
import type { KabupatenOption } from "@/components/checkout/CheckoutShipping";

export default function CheckoutClient() {
  /* ================= ADDRESS ================= */
  const [form, setForm] = useState({ nama: "", nohp: "", alamat: "" });

  const isAddressComplete =
    form.nama.trim() !== "" && form.nohp.trim() !== "" && form.alamat.trim() !== "";

  /* ================= CART ================= */
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("checkoutData");
    if (!raw) return;

    const parsed = JSON.parse(raw) as CheckoutData;

    setItems(
      parsed.items.map((item, idx) => ({
        id: item.id ?? idx,
        name: item.name,
        image: item.image ?? "/placeholder.png",
        price: Number(item.price),
        weight: Number(item.weight),
        qty: Number(item.qty),
        variations: item.variations,
      }))
    );

    setSubtotal(parsed.subtotal ?? 0);

    if (parsed.customer) {
      setForm({
        nama: parsed.customer.name ?? "",
        nohp: parsed.customer.phone ?? "",
        alamat: parsed.customer.address ?? "",
      });
    }
  }, []);

  /* ================= SHIPPING ================= */
  const [selectedService, setSelectedService] = useState<CourierService | null>(null);
  const [selectedKab, setSelectedKab] = useState<KabupatenOption | null>(null);
  const ongkir = selectedService?.cost ?? 0;
  const total = subtotal + ongkir;

  /* ================= PAYMENT ================= */
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "midtrans">("whatsapp");
  const [loadingPay, setLoadingPay] = useState(false);
  const canCheckout = isAddressComplete && items.length > 0 && Boolean(selectedService);

  /* ================= PAY ================= */
  async function handlePay() {
    if (!canCheckout) return;

    const checkoutData: CheckoutData = {
      orderId: `ORD-${Date.now()}`,
      customer: {
        name: form.nama,
        phone: form.nohp,
        address: form.alamat,
        city: selectedKab?.label ?? "-",
      },
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        weight: i.weight,
        image: i.image,
        variations: i.variations,
      })),
      shipping: {
        courier: selectedService!.courier,
        service: selectedService!.service,
        cost: selectedService!.cost,
      },
      subtotal,
      total_weight: items.reduce((sum, i) => sum + i.weight * i.qty, 0),
      total,
      payment_method: paymentMethod,
      payment_status: "pending",
    };

    setLoadingPay(true);

    try {
      // 1️⃣ Simpan order
      await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      // 2️⃣ WhatsApp
      if (paymentMethod === "whatsapp") {
        const text = encodeURIComponent(buildWhatsAppMessage(checkoutData));
        window.location.href = "https://wa.me/6281224128899?text=" + text;
        return;
      }

      // 3️⃣ Midtrans
      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });
      const { token } = await res.json();
      if (!token) throw new Error("Token Midtrans kosong");
      window.snap.pay(token);
    } catch (err) {
      console.error("CHECKOUT ERROR", err);
      alert("Terjadi kesalahan saat checkout. Cek console.");
    } finally {
      setLoadingPay(false);
    }
  }

  return (
    <>
      <CheckoutHeader />

      <section className="pb-40 px-4 pt-4 bg-pink-50 min-h-screen">
        <div className="max-w-md mx-auto space-y-6">
          <CheckoutAddress form={form} setForm={setForm} />
          <CheckoutShipping
            items={items}
            onSelectService={setSelectedService}
            onSelectKabupaten={setSelectedKab}
            addressComplete={isAddressComplete}
          />
          <CheckoutPayment value={paymentMethod} onChange={setPaymentMethod} />

          {/* Item List */}
          <div className="bg-white rounded-3xl shadow-md overflow-hidden divide-y divide-pink-100">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 p-4">
                <div className="relative w-20 aspect-square rounded-xl overflow-hidden bg-pink-50">
                  <Image
                    src={cloudinaryImage(i.image, 400)}
                    alt={i.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{i.name}</p>
                  {i.variations && (
                    <p className="text-sm text-gray-500 truncate">
                      {Object.entries(i.variations)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}
                    </p>
                  )}
                  <p className="text-pink-700 font-semibold mt-1">
                    Rp {i.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-400">Berat: {i.weight} gr</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {i.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <CheckoutSummary items={items} subtotal={subtotal} ongkir={ongkir} total={total} />
        </div>

        {/* Sticky Submit */}
        <CheckoutSubmit
          paymentMethod={paymentMethod}
          loading={loadingPay}
          onPay={handlePay}
          disabled={!canCheckout}
          total={total}
          sticky={true} // ✅ sekarang aman
        />
      </section>
    </>
  );
}
