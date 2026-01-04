import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { GlobalToaster } from "@/components/GlobalToaster"
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "Khadeeja Hijab",
  description: "Tampil Anggun & Syar’i dengan Khadeeja Hijab",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      
      <body>
        <CartProvider>{children}</CartProvider>
        <GlobalToaster /> {/* harus ada supaya toast muncul di semua halaman */}
      {/* MIDTRANS SNAP */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
      
    </html>
  )
}