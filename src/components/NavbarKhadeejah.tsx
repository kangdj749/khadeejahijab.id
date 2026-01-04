"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { items, getTotalQty, getTotal } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      <div className="backdrop-blur-xl bg-white/80 border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image src="/logo-khadeejah.png" alt="Khadeeja Hijab" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-pink-700 tracking-tight">Khadeeja Hijab</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Beranda", "Keunggulan", "Produk", "Tentang", "Kontak"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="relative text-gray-700 hover:text-pink-700 font-medium transition group">
                {link}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowCart(!showCart)} className="relative text-pink-700 hover:text-pink-800 transition">
                <ShoppingBag size={24} />
                {getTotalQty() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {getTotalQty()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showCart && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="absolute right-0 mt-3 w-72 sm:w-80 bg-white border border-pink-100 shadow-lg rounded-xl overflow-hidden z-50">
                    {items.length > 0 ? (
                      <div className="p-4 space-y-3">
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={item.product.image ?? "/placeholder.png"} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex flex-col flex-1 text-sm">
                                <span className="font-medium text-gray-800 line-clamp-1">{item.product.name}</span>
                                <span className="text-gray-500 text-xs">
                                  {item.qty}x Rp {(item.product.discountPrice ?? item.product.price).toLocaleString("id-ID")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-pink-100 pt-3 text-right">
                          <p className="text-gray-700 text-sm">Total: <span className="font-semibold text-pink-700">Rp {getTotal().toLocaleString("id-ID")}</span></p>
                          <Link href="/keranjang" onClick={() => setShowCart(false)} className="mt-2 inline-block w-full text-center bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition font-medium text-sm">Lihat Keranjang</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-sm">Keranjang kamu masih kosong 💕</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-pink-700">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="md:hidden bg-white/95 backdrop-blur-xl border-b border-pink-100 shadow-lg">
            <div className="flex flex-col p-6 space-y-4">
              {["Beranda", "Produk", "Tentang", "Kontak"].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-pink-700 transition text-base font-medium">{link}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
