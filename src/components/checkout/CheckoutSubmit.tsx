// components/checkout/CheckoutSubmit.tsx
"use client";

import React from "react";

type Props = {
  paymentMethod: "whatsapp" | "midtrans";
  loading: boolean;
  onPay: () => Promise<void>;
  disabled: boolean;
  total: number;
  sticky?: boolean; // ✅ tambahkan sticky sebagai optional
};

export default function CheckoutSubmit({
  paymentMethod,
  loading,
  onPay,
  disabled,
  total,
  sticky = false,
}: Props) {
  return (
    <div
      className={`bg-white border-t border-pink-200 p-4 ${
        sticky
          ? "fixed bottom-0 left-0 w-full max-w-md mx-auto z-50 shadow-lg rounded-t-3xl"
          : ""
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700">Total</span>
        <span className="font-bold text-pink-700">
          Rp {total.toLocaleString("id-ID")}
        </span>
      </div>
      <button
        onClick={onPay}
        disabled={disabled || loading}
        className={`w-full py-3 rounded-xl text-white font-semibold transition ${
          disabled || loading
            ? "bg-pink-300 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {loading ? "Memproses..." : `Bayar via ${paymentMethod}`}
      </button>
    </div>
  );
}
