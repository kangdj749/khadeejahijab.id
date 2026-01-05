export default function PaymentFinishPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md text-center space-y-4">
        <h1 className="text-xl font-bold text-pink-600">
          Terima kasih 🌸
        </h1>

        <p className="text-gray-600 text-sm">
          Pembayaran kamu sedang diproses.
          Kami akan menghubungi via WhatsApp jika sudah dikonfirmasi.
        </p>

        <p className="text-xs text-gray-400">
          Mohon jangan tutup halaman ini.
        </p>
      </div>
    </div>
  );
}
