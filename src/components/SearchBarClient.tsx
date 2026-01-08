"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBarClient({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = params.get("category");
    const url = new URLSearchParams();

    if (value) url.set("q", value);
    if (category) url.set("category", category);

    router.push(`/search?${url.toString()}`);
  };

  return (
    <form onSubmit={submit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari produk..."
        className="w-full rounded-full border px-5 py-3"
      />
    </form>
  );
}
