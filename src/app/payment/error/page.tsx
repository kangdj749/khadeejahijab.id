export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md text-center space-y-4">
        <h1 className="text-xl font-bold text-red-600">
          Pembayaran gagal ❌
        </h1>

        <p className="text-gray-600 text-sm">
          Terjadi kendala saat pembayaran.
          Silakan ulangi atau hubungi admin.
        </p>
      </div>
    </div>
  );
}
