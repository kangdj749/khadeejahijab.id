"use client";

interface Props {
  value: "whatsapp" | "midtrans";
  onChange: (v: "whatsapp" | "midtrans") => void;
}

export default function CheckoutPayment({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Metode Pembayaran</h3>

      <button
        onClick={() => onChange("whatsapp")}
        className={`w-full p-4 border rounded-xl text-left ${
          value === "whatsapp" ? "border-green-600" : ""
        }`}
      >
        Bayar via WhatsApp
      </button>

      <button
        onClick={() => onChange("midtrans")}
        className={`w-full p-4 border rounded-xl text-left ${
          value === "midtrans" ? "border-blue-600" : ""
        }`}
      >
        Bayar Otomatis (Midtrans)
      </button>
    </div>
  );
}
