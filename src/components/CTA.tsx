"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PhoneCall, ClipboardList } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function CTA() {
  const whatsappNumber = "62882000015029" // tanpa 0
  const defaultMessage = encodeURIComponent(
    "Halo, saya ingin konsultasi dan pesan layanan Nusa Home Care 🌿"
  )

  const searchParams = useSearchParams()
  const fundriser = searchParams.get("fundriser")

  // Buat link registrasi sesuai ada/tidaknya fundriser
  const registrasiLink = fundriser
    ? `/registrasi?fundriser=${encodeURIComponent(fundriser)}`
    : "/registrasi"

  return (
    <section
      id="cta"
      className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white"
    >
      <div className="container mx-auto px-6 md:px-12 text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            🌿 Hidup lebih sehat, lebih tenang, tanpa ribet
          </h2>
          <p className="text-green-100 text-base md:text-lg leading-relaxed">
            Dengan <span className="font-semibold">Nusa Home Care</span>, keluarga Anda mendapatkan perawatan 
            profesional dengan rasa penuh kasih.  
            Klik tombol di bawah ini untuk konsultasi GRATIS & pesan layanan sekarang juga.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Button ke Form Registrasi */}
          <Button
            asChild
            className="bg-white-50 text-green-700 hover:bg-green-50 rounded-xl px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            <a href={registrasiLink}>
              <ClipboardList className="w-5 h-5 mr-2 inline-block" />
              Daftar Sekarang
            </a>
          </Button>

          {/* Button ke WhatsApp */}
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-green-800 rounded-xl px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            <a
              href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PhoneCall className="w-5 h-5 mr-2 inline-block" />
              Hubungi via WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
