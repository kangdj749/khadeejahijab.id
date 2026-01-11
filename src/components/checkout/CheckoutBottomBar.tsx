type Props = {
  total: number;
  paymentMethod: "manual" | "midtrans";
  onSubmit: () => void;
};

export default function CheckoutBottomBar({
  total,
  paymentMethod,
  onSubmit,
}: Props) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-background border border-border border-t p-4 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between mb-2">
          <span className="text-foreground font-bold">Total</span>
          <span className="font-bold text-lg text-primary">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={onSubmit}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl"
        >
          {paymentMethod === "manual"
            ? "Pesan via WhatsApp"
            : "Bayar Sekarang"}
        </button>
      </div>
    </footer>
  );
}
