import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

import NavbarKhadeejah from "@/components/NavbarKhadeejah";
import FooterKhadeejah from "@/components/FooterKhadeejah";
import { GlobalToaster } from "@/components/GlobalToaster";
import { CartProvider } from "./context/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: {
    default: "Khadeejah Hijab",
    template: "%s | Khadeejah Hijab",
  },
  description: "Tampil Anggun & Syar’i dengan Khadeejah Hijab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white text-gray-800">
        {/* PROVIDER HARUS PALING LUAR */}
        <CartProvider>
          {/* ✅ GLOBAL NAVBAR */}
          <NavbarKhadeejah />

          {/* PAGE CONTENT */}
          <main className="min-h-screen pt-16 sm:pt-20">
            {children}
            <MobileBottomNav/>
          </main>

          {/* OPTIONAL GLOBAL FOOTER */}
          <FooterKhadeejah />
        </CartProvider>

        {/* GLOBAL TOAST */}
        <GlobalToaster />

        {/* MIDTRANS SNAP */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
