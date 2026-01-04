"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TentangKamiKhadeejah() {
  return (
    <section
      id="tentang"
      className="bg-gradient-to-b from-white to-[#f8f5ff] py-14 sm:py-20 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <motion.div
          className="flex-1 relative w-full h-64 sm:h-80 md:h-96"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/Khadeeja-Hijab-ALESHA-MALAY.jpg"
            alt="Tentang Khadeejah Hijab"
            fill
            className="object-cover rounded-3xl shadow-lg"
          />
        </motion.div>

        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
            Tentang <span className="text-[#8A4FFF]">Khadeejah Hijab</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Berdiri dari semangat untuk menghadirkan keanggunan muslimah,
            <span className="font-medium text-gray-800"> Khadeejah Hijab </span>
            hadir dengan koleksi hijab yang elegan, modern, dan nyaman
            digunakan sehari-hari.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Kami percaya setiap wanita berhak tampil cantik tanpa mengorbankan
            kenyamanan. Produk kami dibuat dengan bahan pilihan terbaik,
            menjadikan setiap hijab bukan hanya pelengkap gaya, tetapi juga
            bagian dari kepercayaan diri.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
