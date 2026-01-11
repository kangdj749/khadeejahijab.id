"use client";

interface Props {
  form: {
    nama: string;
    nohp: string;
    alamat: string;
    
  };
  setForm: (v: Props["form"]) => void;
}

export default function CheckoutAddress({ form, setForm }: Props) {
  return (
    <div className="bg-card rounded-2xl p-4 space-y-4 shadow-sm border border-border">
      <h3 className="font-semibold text-primary">Alamat Pengiriman</h3>

      <input
        placeholder="Nama"
        value={form.nama}
        onChange={(e) =>
          setForm({ ...form, nama: e.target.value })
        }
        className="w-full border border-border rounded-lg p-3"
      />

      <input
        placeholder="No HP"
        value={form.nohp}
        onChange={(e) =>
          setForm({ ...form, nohp: e.target.value })
        }
        className="w-full border border-border rounded-lg p-3"
      />

      <textarea
        placeholder="Alamat Lengkap"
        value={form.alamat}
        onChange={(e) =>
          setForm({ ...form, alamat: e.target.value })
        }
        className="w-full border border-border rounded-lg p-3"
      />
    </div>
  );
}
