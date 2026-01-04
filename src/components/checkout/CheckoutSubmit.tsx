interface Props {
  paymentMethod: "whatsapp" | "midtrans";
  loading: boolean;
  disabled: boolean;
  total: number;
  onPay: () => void;
}

export default function CheckoutSubmit({
  paymentMethod,
  loading,
  disabled,
  total,
  onPay,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex justify-between font-semibold">
          <span>Total Bayar</span>
          <span className="text-pink-600">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={onPay}
          disabled={loading || disabled}
          className="w-full bg-pink-800 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
        >
          {paymentMethod === "whatsapp"
            ? "Pesan via WhatsApp"
            : "Bayar Sekarang"}
        </button>
      </div>
    </div>
  );
}
