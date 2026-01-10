"use client";

import { useEffect} from "react";
import AOS from "aos";

import HeroPremium from "@/components/HeroPremium";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeCuratedProducts from "@/components/HomeCuratedProducts";
import TestimoniKhadeejah from "@/components/TestimoniKhadeejah";
import TentangKamiKhadeejah from "@/components/TentangKamiKhadeejah";
import HybridWhatsAppCTA from "@/components/HybridWhatsAppCTA";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <main className="bg text-gray-800">
      {/* Hero */}
      <section id="beranda" className="pt-16 sm:pt-20">
        <HeroPremium />
      </section>

      {/* Produk */}
      <section
        id="produk"
        className="py-12 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto"
      >
        <HomeSearchBar />
        <HomeCuratedProducts />
      </section>

      {/* Testimoni */}
      <section id="testimoni" className="bg-gray-50 py-12">
        <TestimoniKhadeejah />
      </section>

      {/* Tentang */}
      <section id="tentang" className="py-12 px-4 sm:px-6 lg:px-10">
        <TentangKamiKhadeejah />
      </section>

      <HybridWhatsAppCTA />
    </main>
  );
}
