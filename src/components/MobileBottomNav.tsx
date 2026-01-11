"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, BookOpen } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import clsx from "clsx";

const HIDDEN_PATHS = [
  "/keranjang",
  "/checkout",
  "/konfirmasi",
  "/terima-kasih",
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getTotalQty } = useCart();

  // ❌ Jangan tampil di halaman sensitif
  if (
    HIDDEN_PATHS.some((path) =>
      pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    return null;
  }

  const nav = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Produk", href: "/produk", icon: Grid },
    { label: "Koleksi", href: "/koleksi", icon: ShoppingBag },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];

  return (
    <nav
      className="
        fixed bottom-3 left-1/2 -translate-x-1/2
        z-50 md:hidden
        w-[92%]
        bg-card/95 backdrop-blur-xl
        border border-border
        rounded-2xl
        shadow-xl
        px-2
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <ul className="flex items-center justify-between">
        {nav.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={clsx(
                  `
                  flex flex-col items-center gap-1
                  py-2
                  text-xs font-medium
                  transition
                `,
                  active
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                )}
              >
                <div
                  className={clsx(
                    `
                    relative
                    flex items-center justify-center
                    w-10 h-10 rounded-xl
                    transition
                  `,
                    active
                      ? "bg-primary/15"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon size={20} />

                  {/* CART BADGE */}
                  {label === "Koleksi" && getTotalQty() > 0 && (
                    <span
                      className="
                        absolute -top-1 -right-1
                        bg-primary text-primary-foreground
                        text-[10px] font-semibold
                        w-4 h-4 rounded-full
                        flex items-center justify-center
                      "
                    >
                      {getTotalQty()}
                    </span>
                  )}
                </div>

                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
