"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentFinishPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("order_id");
  const transactionStatus = params.get("transaction_status");

  /* ================= STATUS MAP ================= */
  const statusMap: Record<
    string,
    {
      title: string;
      message: string;
      color: string;
    }
  > = {
    settlement: {
      title: "Pembayaran Berhasil 🎉",
      message:
        "Pembayaran kamu berhasil. Pesanan akan segera kami proses.",
      color: "text-green-600",
    },
    capture: {
      title: "Pembayaran Berhasil 🎉",
      message:
        "Pembayaran kamu berhasil. Pesanan akan segera kami proses.",
      color: "text-green-600",
    },
    pending: {
      title: "Menunggu Pembayaran ⏳",
      message:
        "Pembayaran belum selesai. Silakan selesaikan pembayaran sesuai instruksi.",
      color: "text-yellow-600",
    },
    deny: {
      title: "Pembayaran Ditolak ❌",
      message:
        "Pembayaran ditolak. Silakan coba metode pembayaran lain.",
      color: "text-red-600",
    },
    cancel: {
      title: "Pembayaran Dibatalkan ❌",
      message:
        "Kamu membatalkan pembayaran. Silakan ulangi checkout jika ingin melanjutkan.",
      color: "text-red-600",
    },
    expire: {
      title: "Pembayaran Kedaluwarsa ⌛",
      message:
        "Waktu pembayaran habis. Silakan ulangi checkout.",
      color: "text-red-600",
    },
  };

  const status =
    transactionStatus && statusMap[transactionStatus]
      ? statusMap[transactionStatus]
      : {
          title: "Status Pembayaran Tidak Diketahui",
          message:
            "Kami akan menghubungi kamu melalui WhatsApp untuk konfirmasi.",
          color: "text-gray-600",
        };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center space-y-4">
        <h1 className={`text-xl font-bold ${status.color}`}>
          {status.title}
        </h1>

        {orderId && (
          <p className="text-xs text-gray-500">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}

        <p className="text-gray-600 text-sm">
          {status.message}
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="rounded-xl bg-pink-600 text-white py-3 text-sm font-semibold hover:bg-pink-700 transition"
          >
            Kembali ke Beranda
          </Link>

          <button
            onClick={() => router.push("/keranjang")}
            className="rounded-xl border border-pink-400 text-pink-600 py-3 text-sm font-medium hover:bg-pink-50 transition"
          >
            Lihat Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
