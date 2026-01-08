"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function NavbarKhadeejah() {
  //const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  const { items, getTotalQty, getTotal } = useCart();

  /** helper: link ke section HOME */
  const homeLink = (hash: string) => `/${hash}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="backdrop-blur-xl bg-white/80 border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-khadeejah.png"
                alt="Khadeejah Hijab"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-pink-700">
              Khadeejah Hijab
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={homeLink("#beranda")} className="nav-link">
              Beranda
            </Link>
            <Link href="/search" className="nav-link">
              Produk
            </Link>
            <Link href={homeLink("#tentang")} className="nav-link">
              Tentang
            </Link>
            <Link href={homeLink("#kontak")} className="nav-link">
              Kontak
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* SEARCH (DESKTOP) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-white rounded-full border px-3 py-1 shadow-sm"
            >
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk…"
                className="ml-2 text-sm outline-none w-36"
              />
            </form>

            {/* CART */}
            <div className="relative">
              <button
                onClick={() => setShowCart((p) => !p)}
                className="relative text-pink-700"
              >
                <ShoppingBag size={24} />
                {getTotalQty() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getTotalQty()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50"
                  >
                    {items.length > 0 ? (
                      <div className="p-4 space-y-3">
                        {items.map((item, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <div className="relative w-14 h-14 rounded overflow-hidden">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.qty} × Rp{" "}
                                {(item.product.discountPrice ??
                                  item.product.price
                                ).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="border-t pt-3 text-right">
                          <p className="text-sm">
                            Total:{" "}
                            <span className="font-semibold text-pink-600">
                              Rp {getTotal().toLocaleString("id-ID")}
                            </span>
                          </p>
                          <Link
                            href="/keranjang"
                            onClick={() => setShowCart(false)}
                            className="block mt-2 bg-pink-600 text-white py-2 rounded-lg text-center text-sm"
                          >
                            Lihat Keranjang
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-500">
                        Keranjang masih kosong
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsOpen((p) => !p)}
              className="md:hidden text-pink-700"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b shadow"
          >
            <div className="p-6 space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk…"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button className="bg-pink-600 text-white px-4 rounded-lg">
                  Cari
                </button>
              </form>

              <Link href={homeLink("#beranda")} onClick={() => setIsOpen(false)}>
                Beranda
              </Link>
              <Link href="/search" onClick={() => setIsOpen(false)}>
                Produk
              </Link>
              <Link href={homeLink("#tentang")} onClick={() => setIsOpen(false)}>
                Tentang
              </Link>
              <Link href={homeLink("#kontak")} onClick={() => setIsOpen(false)}>
                Kontak
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
