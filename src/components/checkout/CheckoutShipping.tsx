"use client";

import { useState } from "react";
import wilayahData from "@/data/wilayah-biteship.json";

/* ================= TYPES ================= */

export type KabupatenOption = {
  id: string;
  label: string;
  postalCode: string;
};

export type CourierService = {
  service: string;
  cost: number;
  etd: string;
  courier: string;
};

type ShippingItem = {
  name: string;
  price: number;
  weight: number;
  qty: number;
};

type Props = {
  items: ShippingItem[];
  onSelectService: (s: CourierService) => void;
  onSelectKabupaten: (k: KabupatenOption) => void;
  addressComplete: boolean;
};

/* ================= COMPONENT ================= */

export default function CheckoutShipping({
  items,
  onSelectService,
  onSelectKabupaten,
  addressComplete,
}: Props) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<KabupatenOption[]>([]);
  const [selectedKab, setSelectedKab] =
    useState<KabupatenOption | null>(null);

  const [services, setServices] = useState<CourierService[]>([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 SEARCH DARI JSON */
  const handleSearch = (val: string) => {
    setSearch(val);

    if (val.length < 3) {
      setFiltered([]);
      return;
    }

    setFiltered(
      wilayahData.filter((w) =>
        w.label.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  /* 🚚 CEK ONGKIR */
  const fetchOngkir = async () => {
    if (!selectedKab || !items.length) return;

    setLoading(true);
    setServices([]);

    try {
      const res = await fetch("/api/ongkir/biteship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationPostalCode: selectedKab.postalCode,
          couriers: ["jne", "jnt", "sicepat", "anteraja", "pos"],
          items,
        }),
      });

      const json = await res.json();

      if (Array.isArray(json?.services)) {
        setServices(json.services);
      }
    } catch (err) {
      console.error("❌ Gagal ambil ongkir", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
      <h3 className="font-semibold">Pengiriman</h3>

      {/* 🔍 SEARCH + BUTTON */}
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari kota / kabupaten"
          className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={fetchOngkir}
          disabled={!selectedKab || loading || !addressComplete}
          className="rounded-xl bg-pink-600 px-4 text-white text-sm disabled:opacity-50"
        >
          Cek
        </button>
      </div>

      {!addressComplete && (
        <p className="text-xs text-red-500">
          Lengkapi alamat terlebih dahulu untuk cek ongkir
        </p>
      )}

      {/* 📍 HASIL SEARCH */}
      {filtered.length > 0 && (
        <div className="rounded-xl border max-h-48 overflow-auto">
          {filtered.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setSelectedKab(w);
                onSelectKabupaten(w);
                setSearch(w.label);
                setFiltered([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-pink-50 text-sm"
            >
              {w.label}
            </button>
          ))}
        </div>
      )}

      {/* ⏳ LOADING */}
      {loading && (
        <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
      )}

      {/* 🚚 LIST ONGKIR */}
      {services.map((s) => (
        <button
          key={`${s.courier}-${s.service}`}
          onClick={() => onSelectService(s)}
          className="w-full rounded-xl border px-4 py-3 flex justify-between items-center hover:bg-pink-50"
        >
          <div>
            <div className="font-semibold text-sm">
              {s.courier.toUpperCase()} – {s.service}
            </div>
            <div className="text-xs text-gray-500">
              Estimasi {s.etd} hari
            </div>
          </div>
          <div className="font-semibold text-pink-600">
            Rp {s.cost.toLocaleString("id-ID")}
          </div>
        </button>
      ))}
    </div>
  );
}
