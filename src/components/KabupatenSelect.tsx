"use client";

import wilayah from "@/data/wilayah-biteship.json";
import type { KabupatenOption } from "@/types/wilayah";

type Props = {
  value: KabupatenOption | null;
  onSelect: (v: KabupatenOption) => void;
};

export default function KabupatenSelect({ value, onSelect }: Props) {
  const options = wilayah as KabupatenOption[];

  return (
    <select
      className="w-full rounded-lg border px-4 py-2"
      value={value?.id ?? ""}
      onChange={(e) => {
        const selected = options.find(
          (o) => o.id === e.target.value
        );
        if (selected) onSelect(selected);
      }}
    >
      <option value="">Pilih Kabupaten / Kota</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
