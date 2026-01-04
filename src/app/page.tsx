"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
//import "aos/dist/aos.css";
import HybridWhatsAppCTA from "@/components/HybridWhatsAppCTA";
import ProductGridInfinite from "@/components/ProductGridInfinite";
import { Product } from "@/types";
import NavbarKhadeejah from "@/components/NavbarKhadeejah";
//import HeroKhadeejah from "@/components/HeroKhadeejah";
import FooterKhadeejah from "@/components/FooterKhadeejah";
import TestimoniKhadeejah from "@/components/TestimoniKhadeejah";
import TentangKamiKhadeejah from "@/components/TentangKamiKhadeejah";
import HeroPremium from "@/components/HeroPremium";

export default function LandingPage() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

    const fetchInitial = async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=8");
        const data = await res.json();
        setInitialProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching initial products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  return (
    <main className="relative bg-white text-gray-800 overflow-hidden">
      {/* 🌿 Navbar Sticky */}
      <NavbarKhadeejah />

      {/* 🌞 Hero Section */}
      <section id="beranda" className="pt-16 sm:pt-20">
        <HeroPremium />
      </section>

      {/* 💎 Keunggulan / Value Proposition */}
<section
  id="keunggulan"
  className="py-14 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-pink-50 to-white"
  data-aos="fade-up"
>
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
      Mengapa Belanja Langsung di Website Kami?
    </h2>

    <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
      Khadeeja Hijab memberikan pengalaman belanja eksklusif bagi pelanggan yang
      checkout langsung di website ini 💕 Dapatkan harga spesial, promo terbatas,
      dan pelayanan prioritas tanpa harus lewat marketplace.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
      {[
        {
          icon: "💖",
          title: "Harga Lebih Hemat",
          desc: "Langsung dari kami tanpa biaya tambahan marketplace — harga lebih bersahabat di website ini!",
        },
        {
          icon: "🎁",
          title: "Bonus & Promo Eksklusif",
          desc: "Nikmati diskon, voucher, dan hadiah spesial yang hanya tersedia untuk pembelian di website.",
        },
        {
          icon: "⚡",
          title: "Stok & Update Real-Time",
          desc: "Kamu selalu dapat produk terbaru lebih dulu, sebelum muncul di marketplace lain.",
        },
        {
          icon: "💳",
          title: "Pembayaran Aman & Cepat",
          desc: "Transaksi langsung ke Khadeeja Hijab dengan pilihan QRIS, transfer bank, dan e-wallet terpercaya.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="text-4xl mb-3">{item.icon}</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
        </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="#produk"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-pink-700 transition shadow-md"
          >
            Belanja Sekarang di Website 💕
          </a>
        </div>
      </div>
    </section>


      {/* 🛍️ Produk Kami */}
      <section
        id="produk"
        className="py-12 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          🛍️ Produk Kami
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-sm p-3"
              >
                <div className="w-full aspect-square bg-gray-200 rounded-xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGridInfinite initialProducts={initialProducts} />
        )}
      </section>

      {/* 💬 Testimoni Pelanggan */}
      <section id="testimoni" className="bg-gray-50 py-12" data-aos="fade-up">
        <TestimoniKhadeejah />
      </section>

      {/* 🏭 Tentang Kami */}
      <section id="tentang" className="py-12 px-4 sm:px-6 lg:px-10" data-aos="fade-up">
        <TentangKamiKhadeejah />
      </section>

      {/* 📱 CTA WhatsApp Floating */}
      <HybridWhatsAppCTA />

      {/* 🦶 Footer */}
      <FooterKhadeejah />
    </main>
  );
}
