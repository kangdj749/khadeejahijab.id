"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Tag,
  BookOpen,
  User,
} from "lucide-react";
import { useState } from "react";
import KoleksiSheet from "./KoleksiSheet";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Koleksi", href: "#koleksi", icon: LayoutGrid },
  { label: "Promo", href: "/promo", icon: Tag },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Akun", href: "/akun", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [openKoleksi, setOpenKoleksi] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-sm md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const active =
              item.href !== "#koleksi" &&
              pathname === item.href;

            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() =>
                  item.href === "#koleksi"
                    ? setOpenKoleksi(true)
                    : null
                }
                className={`flex flex-col items-center py-2 text-xs ${
                  active
                    ? "text-primary font-semibold"
                    : "text-gray-500"
                }`}
              >
                {item.href !== "#koleksi" ? (
                  <Link href={item.href} className="flex flex-col items-center">
                    <Icon size={20} />
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <Icon size={20} />
                    {item.label}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* SHEET */}
      <KoleksiSheet
        open={openKoleksi}
        onClose={() => setOpenKoleksi(false)}
      />
    </>
  );
}
