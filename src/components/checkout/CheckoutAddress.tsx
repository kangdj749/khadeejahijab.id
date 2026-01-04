"use client";

interface Props {
  form: {
    nama: string;
    nohp: string;
    alamat: string;
    kota : string;
  };
  setForm: (v: Props["form"]) => void;
}

export default function CheckoutAddress({ form, setForm }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Alamat Pengiriman</h3>

      <input
        placeholder="Nama"
        value={form.nama}
        onChange={(e) =>
          setForm({ ...form, nama: e.target.value })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="No HP"
        value={form.nohp}
        onChange={(e) =>
          setForm({ ...form, nohp: e.target.value })
        }
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Alamat Lengkap"
        value={form.alamat}
        onChange={(e) =>
          setForm({ ...form, alamat: e.target.value })
        }
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}
