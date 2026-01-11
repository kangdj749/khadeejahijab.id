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
      className={`bg-primary-foreground border-t border-primary-soft p-4 ${
        sticky
          ? "fixed bottom-0 left-0 w-full max-w-md mx-auto z-50 shadow-lg rounded-t-3xl"
          : ""
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-bold text-primary">
          Rp {total.toLocaleString("id-ID")}
        </span>
      </div>
      <button
        onClick={onPay}
        disabled={disabled || loading}
        className={`w-full py-3 rounded-xl text-primary-foreground font-semibold transition ${
          disabled || loading
            ? "bg-primary cursor-not-allowed"
            : "bg-primary hover:opacity-70"
        }`}
      >
        {loading ? "Memproses..." : `Bayar via ${paymentMethod}`}
      </button>
    </div>
  );
}
