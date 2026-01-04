"use client";

import { useRouter } from "next/navigation";

export default function CheckoutHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-md mx-auto flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => router.back()}
          className="text-xl font-semibold"
        >
          ←
        </button>

        <h1 className="font-semibold text-lg">Checkout</h1>
      </div>
    </header>
  );
}
