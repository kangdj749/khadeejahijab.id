"use client";

import { useEffect, useState } from "react";
import AOS from "aos";

import NavbarKhadeejah from "@/components/NavbarKhadeejah";
import HeroPremium from "@/components/HeroPremium";
import ProductGridInfinite from "@/components/ProductGridInfinite";
import TestimoniKhadeejah from "@/components/TestimoniKhadeejah";
import TentangKamiKhadeejah from "@/components/TentangKamiKhadeejah";
import FooterKhadeejah from "@/components/FooterKhadeejah";
import HybridWhatsAppCTA from "@/components/HybridWhatsAppCTA";

import { Product } from "@/types";

export default function LandingPage() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

    const fetchInitialProducts = async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=8", {
          cache: "no-store",
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setInitialProducts(data);
        } else {
          setInitialProducts([]);
        }
      } catch (err) {
        console.error("❌ fetch products error:", err);
        setInitialProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []);

  return (
    <main className="relative bg-white text-gray-800 overflow-hidden">
      {/* Navbar */}
      <NavbarKhadeejah />

      {/* Hero */}
      <section id="beranda" className="pt-16 sm:pt-20">
        <HeroPremium />
      </section>

      {/* Produk */}
      <section
        id="produk"
        className="py-12 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          🛍️ Produk Kami
        </h2>

        {/* LOADING SKELETON */}
        {loading && (
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
        )}

        {/* GRID (HANYA JIKA DATA ADA) */}
        {!loading && initialProducts.length > 0 && (
          <ProductGridInfinite initialProducts={initialProducts} />
        )}

        {/* EMPTY STATE */}
        {!loading && initialProducts.length === 0 && (
          <p className="text-center text-gray-500">
            Produk belum tersedia
          </p>
        )}
      </section>

      {/* Testimoni */}
      <section id="testimoni" className="bg-gray-50 py-12" data-aos="fade-up">
        <TestimoniKhadeejah />
      </section>

      {/* Tentang Kami */}
      <section id="tentang" className="py-12 px-4 sm:px-6 lg:px-10" data-aos="fade-up">
        <TentangKamiKhadeejah />
      </section>

      {/* WhatsApp CTA */}
      <HybridWhatsAppCTA />

      {/* Footer */}
      <FooterKhadeejah />
    </main>
  );
}
