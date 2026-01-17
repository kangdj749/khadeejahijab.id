
"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import AOS from "aos";

import HeroPremium from "@/components/HeroPremium";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeCuratedProducts from "@/components/HomeCuratedProducts";
import TestimoniKhadeejah from "@/components/TestimoniKhadeejah";
import TentangKamiKhadeejah from "@/components/TentangKamiKhadeejah";
import HybridWhatsAppCTA from "@/components/HybridWhatsAppCTA";

export default function HomeClient() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <main className="bg-bg text-text">
      {/* ================= HERO ================= */}
      <section
        id="beranda"
        className="pt-16 sm:pt-20 lg:pt-24"
      >
        <HeroPremium />
      </section>

      {/* ================= PRODUK ================= */}
      <section
        id="produk"
        className="
          relative
          py-12 sm:py-16
          px-4 sm:px-6 lg:px-10
          max-w-6xl mx-auto
        "
        data-aos="fade-up"
      >
        <HomeSearchBar />
        <div className="mt-6 sm:mt-8">
          <HomeCuratedProducts />
        </div>
      </section>

      {/* ================= TESTIMONI ================= */}
      <section
        id="testimoni"
        className="
          bg-surface
          py-14 sm:py-18
        "
        data-aos="fade-up"
      >
        <TestimoniKhadeejah />
      </section>

      {/* ================= TENTANG KAMI ================= */}
      <section
        id="tentang"
        className="
          py-14 sm:py-18
          px-4 sm:px-6 lg:px-10
          max-w-6xl mx-auto
        "
        data-aos="fade-up"
      >
        <TentangKamiKhadeejah />
      </section>

      {/* ================= CTA ================= */}
      <HybridWhatsAppCTA />
    </main>
  );
}
