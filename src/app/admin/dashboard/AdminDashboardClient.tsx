"use client";
export const dynamic = "force-dynamic";

/* ISI FILE = PERSIS KODE DASHBOARD CLIENT YANG KAMU KIRIM */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Variation = {
  variation1Name: string;
  variation1Value: string;
  variation2Name?: string;
  variation2Value?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
};

export default function AdminDashboard() {
  /* =====================
     STATE PRODUK
  ===================== */
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    price: "",
    discountPrice: "",
    weight: "",
    shopee: "",
    tokopedia: "",
    tiktok: "",
  });

  /* =====================
     UPLOAD IMAGE
  ===================== */
  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return data.url as string;
  };

  /* =====================
     VARIATION HANDLER
  ===================== */
  const addVariation = () => {
    setVariations([
      ...variations,
      {
        variation1Name: "Warna",
        variation1Value: "",
        variation2Name: "Size",
        variation2Value: "",
        price: 0,
        discountPrice: 0,
        stock: 0,
        image: "",
      },
    ]);
  };

  const updateVariation = <
    K extends keyof Variation
    >(
    index: number,
    field: K,
    value: Variation[K]
    ) => {
    const copy = [...variations];
    copy[index][field] = value;
    setVariations(copy);
    };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      image,
      gallery,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()),
      price: Number(form.price),
      discountPrice: form.discountPrice
        ? Number(form.discountPrice)
        : "",
      weight: Number(form.weight),
      shopee: form.shopee,
      tokopedia: form.tokopedia,
      tiktok: form.tiktok,
      variations,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Gagal simpan produk");
    } else {
      alert("Produk berhasil disimpan ✅");
    }

    setLoading(false);
  };

  /* =====================
     UI
  ===================== */
  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-32">
      <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">
        Tambah Produk
      </h1>
      <p className="text-sm text-gray-500">
        Isi detail produk dengan lengkap dan rapi
      </p>

      {/* INFO UTAMA */}
      <Card className="rounded-2xl border border-border bg-card">
        <CardContent className="space-y-4 pt-5">
          <Label>Nama Produk</Label>
          <Input className="border border-border"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Label>Deskripsi</Label>
          <Textarea className="border border-border"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Label>Kategori</Label>
          <Input className="border border-border"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <Label>Tags (pisahkan dengan koma)</Label>
          <Input className="border border-border"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* HARGA */}
      <Card className="rounded-2xl border border-border bg-card">
        <CardContent className="space-y-4 pt-5">
          <Label>Harga</Label>
          <Input className="border border-border"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <Label>Harga Diskon</Label>
          <Input className="border border-border"
            type="number"
            value={form.discountPrice}
            onChange={(e) =>
              setForm({ ...form, discountPrice: e.target.value })
            }
          />

          <Label>Berat (gram)</Label>
          <Input className="border border-border"
            type="number"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* MARKETPLACE */}
      <Card className="rounded-2xl border border-border bg-card">
        <CardContent className="space-y-4 pt-5">
          <Label>Shopee</Label>
          <Input className="border border-border"
            value={form.shopee}
            onChange={(e) => setForm({ ...form, shopee: e.target.value })}
          />
          <Label>Tokopedia</Label>
          <Input className="border border-border"
            value={form.tokopedia}
            onChange={(e) =>
              setForm({ ...form, tokopedia: e.target.value })
            }
          />
          <Label>TikTok</Label>
          <Input className="border border-border"
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* IMAGE */}
      <Card className="rounded-2xl border border-border bg-card">
        <CardContent className="space-y-4 pt-5">
          <Label>Thumbnail</Label>
          <Input className="border border-border"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                setImage(await uploadImage(e.target.files[0]));
              }
            }}
          />

          <Label>Gallery</Label>
          <Input className="border border-border"
          type="file"
          multiple
          onChange={async (e) => {
            if (!e.target.files) return;

            const urls: string[] = []; // ✅ FIX: tentukan tipe

            for (const f of Array.from(e.target.files)) {
              const url = await uploadImage(f);
              urls.push(url);
            }

            setGallery((prev) => [...prev, ...urls]);
          }}
        />
        </CardContent>
      </Card>

      {/* VARIATIONS */}
      <Card className="rounded-2xl border border-border bg-card">
        <CardContent className="space-y-4 pt-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-primary">Variasi Produk</h2>
            <Button size="sm" onClick={addVariation}>
              + Tambah
            </Button>
          </div>

          {variations.map((v, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2">
              <Input className="border border-border"
                placeholder="Warna"
                value={v.variation1Value}
                onChange={(e) =>
                  updateVariation(i, "variation1Value", e.target.value)
                }
              />
              <Input className="border border-border"
                placeholder="Size"
                value={v.variation2Value}
                onChange={(e) =>
                  updateVariation(i, "variation2Value", e.target.value)
                }
              />
              <Input className="border border-border"
                type="number"
                placeholder="Harga"
                onChange={(e) =>
                  updateVariation(i, "price", Number(e.target.value))
                }
              />
              <Input className="border border-border"
                type="number"
                placeholder="Harga Diskon"
                onChange={(e) =>
                  updateVariation(i, "discountPrice", Number(e.target.value))
                }
              />
              <Input className="border border-border"
                type="number"
                placeholder="Stok"
                onChange={(e) =>
                  updateVariation(i, "stock", Number(e.target.value))
                }
              />
              <Input className="border border-border"
                type="file"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const url = await uploadImage(e.target.files[0]);
                    updateVariation(i, "image", url);
                  }
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Button
        className="w-full bg-primary text-primary-foreground fixed bottom-4 left-0 right-0 max-w-xl mx-auto"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Menyimpan..." : "Simpan Produk"}
      </Button>
    </div>
  );
}
