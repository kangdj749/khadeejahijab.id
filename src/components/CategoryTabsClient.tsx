"use client";

import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";

type Props = {
  categories: string[];
  active?: string;
};

export default function CategoryTabsClient({
  categories,
  active,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => router.push("/search")}
        className={`px-4 py-2 rounded-full text-sm ${
          !active ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        Semua
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() =>
            router.push(`/category/${slugify(cat)}`)
          }
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            active === cat
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
