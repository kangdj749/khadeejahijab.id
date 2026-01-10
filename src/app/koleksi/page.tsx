import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllKoleksi } from "@/lib/sheets/koleksi";
import { cloudinaryImage } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Koleksi Busana Muslim Wanita Terlengkap",
  description:
    "Temukan koleksi jilbab dan gamis terbaru untuk berbagai kebutuhan. Nyaman dipakai, desain modern, dan siap tampil elegan.",
};

export default async function KoleksiPage() {
  const koleksi = await getAllKoleksi();

  if (!Array.isArray(koleksi) || koleksi.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Koleksi Belum Tersedia</h1>
        <p className="text-gray-500">
          Silakan kembali lagi, koleksi sedang kami siapkan ✨
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
      {/* HERO */}
      <section className="max-w-3xl mb-10">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
          Koleksi Busana Muslim Wanita
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Temukan berbagai koleksi pilihan yang dirancang untuk menunjang
          aktivitas harian hingga acara spesial.
        </p>
      </section>

      {/* GRID KOLEKSI */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {koleksi.map((k) => {
          const imageUrl = cloudinaryImage(k.image, 600);

          return (
            <Link
              key={k.slug}
              href={`/koleksi/${k.slug}`}
              className="
                group bg-white rounded-2xl overflow-hidden
                shadow-soft hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/5] bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={k.h1}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="font-heading font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                  {k.h1}
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                  {k.excerpt ||
                    "Lihat koleksi pilihan dengan desain terbaik dan kualitas nyaman dipakai."}
                </p>

                <span className="inline-block mt-3 text-xs font-medium text-primary">
                  Lihat koleksi →
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h3 className="font-heading font-semibold text-xl mb-3">
          Bingung pilih koleksi yang cocok?
        </h3>
        <p className="text-gray-600 mb-6">
          Jelajahi semua produk kami atau gunakan pencarian.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/produk"
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-medium shadow-soft"
          >
            Lihat Semua Produk
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-full border text-sm font-medium"
          >
            Cari Produk
          </Link>
        </div>
      </section>
    </main>
  );
}
