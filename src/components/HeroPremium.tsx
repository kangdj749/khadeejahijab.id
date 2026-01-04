"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { heroSlides } from "./heroSlides";

export default function HeroPremium() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      {/* BACKGROUND SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroSlides[index].image}
            alt={heroSlides[index].title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-white/90" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center px-5 sm:px-10 lg:px-20">
        <div className="max-w-xl space-y-6 text-white">
          <motion.h1
            key={heroSlides[index].title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
          >
            {heroSlides[index].title}
          </motion.h1>

          <motion.p
            key={heroSlides[index].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-lg sm:text-xl text-white/90"
          >
            {heroSlides[index].subtitle}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="#produk"
              className="bg-pink-500 hover:bg-pink-600 transition px-7 py-3 rounded-full font-semibold text-center"
            >
              🛍️ Belanja Sekarang
            </Link>

            <a
              href="https://shopee.co.id/khadeejahijabofficial"
              target="_blank"
              className="border border-white/70 text-white px-7 py-3 rounded-full font-medium text-center hover:bg-white/10 transition"
            >
              Lihat di Shopee
            </a>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-pink-500" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
