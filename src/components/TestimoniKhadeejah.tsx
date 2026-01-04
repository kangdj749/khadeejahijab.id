"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nadia Rahma",
    comment:
      "Hijabnya lembut banget dan warnanya cantik. Udah beberapa kali repeat order karena nyaman dipakai seharian 💕",
    rating: 5,
  },
  {
    name: "Lailatul Fitri",
    comment:
      "Kualitas bahan dan jahitannya bagus! Warna real pict banget seperti di foto Shopee. Recommended!",
    rating: 5,
  },
  {
    name: "Syifa Amelia",
    comment:
      "Modelnya modis tapi tetap sopan. Cocok banget buat ngantor dan acara formal juga 🌸",
    rating: 4,
  },
];

export default function TestimoniKhadeejah() {
  return (
    <section
      id="testimoni"
      className="bg-white py-14 sm:py-20 px-4 sm:px-6 border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
          Apa Kata Pelanggan Kami 💬
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Terima kasih atas kepercayaanmu. Berikut sebagian ulasan dari
          pelanggan yang telah merasakan kenyamanan dan keanggunan produk kami.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            className="bg-[#f9f7ff] border border-[#ece8ff] rounded-2xl shadow-sm p-6 text-left flex flex-col justify-between hover:shadow-md transition"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <p className="text-gray-700 leading-relaxed mb-4 italic">
              “{item.comment}”
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <div className="flex mt-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
