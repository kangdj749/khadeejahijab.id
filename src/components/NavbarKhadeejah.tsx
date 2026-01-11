"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function NavbarKhadeejah() {
  const router = useRouter();
  const { items, getTotalQty, getTotal } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      {/* ================= TOP BAR ================= */}
      <div className="bg-background/90 backdrop-blur-xl border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9">
              <Image
                src="/logo-khadeejah.png"
                alt="Khadeejah Hijab"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-heading font-bold text-primary text-lg tracking-tight">
              Khadeejah Hijab
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-foreground">
            {["Beranda", "Produk", "Koleksi", "Blog"].map((item) => (
              <Link
                key={item}
                href={item === "Beranda" ? "/" : `/${item.toLowerCase()}`}
                className="hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH DESKTOP */}
            <form
              onSubmit={handleSearch}
              className="
                hidden md:flex items-center gap-2
                bg-card border border-border
                rounded-full px-4 py-1.5
                focus-within:border-primary
                transition
              "
            >
              <Search size={16} className="text-primary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk…"
                className="
                  bg-transparent text-sm outline-none w-36
                  placeholder:text-muted
                "
              />
            </form>

            {/* CART */}
            <button
              onClick={() => setShowCart((p) => !p)}
              className="relative text-primary hover:scale-105 transition"
            >
              <ShoppingBag size={22} />
              {getTotalQty() > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2
                    bg-primary text-primary-foreground
                    text-[11px] font-semibold
                    w-5 h-5 rounded-full
                    flex items-center justify-center
                    ring-2 ring-background
                  "
                >
                  {getTotalQty()}
                </span>
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsOpen((p) => !p)}
              className="md:hidden text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="p-5 space-y-5">
              <form
                onSubmit={handleSearch}
                className="
                  flex items-center gap-2
                  bg-card border border-border
                  rounded-xl px-3 py-2
                "
              >
                <Search size={16} className="text-primary" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk…"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted"
                />
              </form>

              {["Beranda", "Produk", "Koleksi", "Blog"].map((item) => (
                <Link
                  key={item}
                  href={item === "Beranda" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block font-medium text-foreground hover:text-primary transition"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ================= MINI CART ================= */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              fixed right-4 top-20 w-80
              bg-card/95 backdrop-blur-xl
              border border-border
              rounded-2xl shadow-xl z-50
            "
          >
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted">
                Keranjang masih kosong
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1 text-foreground">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.qty} × Rp{" "}
                        {(item.product.discountPrice ??
                          item.product.price
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-border pt-3 text-right">
                  <p className="text-sm text-foreground">
                    Total:{" "}
                    <span className="font-semibold text-primary">
                      Rp {getTotal().toLocaleString("id-ID")}
                    </span>
                  </p>
                  <Link
                    href="/keranjang"
                    onClick={() => setShowCart(false)}
                    className="
                      block mt-3
                      bg-primary text-primary-foreground
                      py-2.5 rounded-xl
                      text-center text-sm font-medium
                      hover:bg-primary/90 transition
                    "
                  >
                    Lihat Keranjang
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
