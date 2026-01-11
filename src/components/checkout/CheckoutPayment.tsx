"use client";

interface Props {
  value: "whatsapp" | "midtrans";
  onChange: (v: "whatsapp" | "midtrans") => void;
}

export default function CheckoutPayment({ value, onChange }: Props) {
  return (
    <div className="bg-card rounded-2xl p-4 space-y-4 shadow-sm border border-border">
      <h3 className="font-semibold text-primary">Metode Pembayaran</h3>

      <button
        onClick={() => onChange("whatsapp")}
        className={`w-full p-4 border border-border rounded-xl text-left ${
          value === "whatsapp" ? "border-primary-soft" : ""
        }`}
      >
        Bayar via WhatsApp
      </button>

      <button
        onClick={() => onChange("midtrans")}
        className={`w-full p-4 border border-border rounded-xl text-left ${
          value === "midtrans" ? "border-primary-soft" : ""
        }`}
      >
        Bayar Otomatis (Midtrans)
      </button>
    </div>
  );
}
