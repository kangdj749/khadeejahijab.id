"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1766843597/products/image-1766843594351.jpg",
    alt: "Khadeeja Hijab Premium",
  },
  {
    src: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1766889654/products/image-1766889650760.jpg",
    alt: "Hijab Syar'i Modern",
  },
  {
    src: "https://res.cloudinary.com/de7fqcvpf/image/upload/v1767407155/products/image-1767407149980.jpg",
    alt: "Khadeeja Hijab Elegan",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <div className="flex flex-col md:flex-row items-center justify-between px-5 sm:px-10 lg:px-16 py-12 md:py-20 gap-10">
        {/* ================= TEXT ================= */}
        <div className="max-w-xl text-center md:text-left space-y-5 z-10">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Tampil Anggun & Syar’i <br />
            dengan{" "}
            <span className="text-pink-500">Khadeeja Hijab</span>
          </motion.h1>

          <p className="text-gray-600 text-base sm:text-lg">
            Koleksi hijab premium yang nyaman dipakai setiap hari — dirancang
            untuk muslimah modern.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-3">
            <Link
              href="#produk"
              className="bg-pink-500 text-white px-6 py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-pink-600 transition"
            >
              🛍️ Belanja Sekarang
            </Link>
            <a
              href="https://shopee.co.id/khadeejahijabofficial"
              target="_blank"
              className="border border-pink-400 text-pink-500 px-6 py-3 rounded-full text-sm sm:text-base font-medium hover:bg-pink-50 transition"
            >
              Lihat di Shopee
            </a>
          </div>
        </div>

        {/* ================= SLIDER ================= */}
        <div className="relative w-full md:w-[480px] h-[360px] sm:h-[420px] md:h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={slides[index].src}
                alt={slides[index].alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover rounded-3xl shadow-xl"
              />
            </motion.div>
          </AnimatePresence>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === index ? "bg-pink-500" : "bg-pink-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
