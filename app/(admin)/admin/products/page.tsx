"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";

export default function AdminProductsPage() {
  // Tambahkan <any[]> agar TypeScript tidak menganggap ini array "never"
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
  setIsLoading(true);
  try {
    // FIX: Tambahkan cache 'no-store' agar data tidak "nyangkut"
    const res = await fetch("/api/products", { cache: 'no-store' });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : data.data || []);
  } catch (err) {
    setError("Koneksi ke server terputus.");
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
  if (confirm(`Yakin ingin menghapus ${name}?`)) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Berhasil dihapus dari database!");
        fetchProducts(); // Langsung ambil data terbaru
      } else {
        alert("❌ Gagal: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("❌ Error Jaringan: Gagal menghubungi server.");
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Inventaris Ikan</h1>
            <p className="text-slate-400 font-medium font-sm">Kelola stok dan pantau resep AI Gemini kamu.</p>
          </div>
          <Link href="/admin/products/add" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
            <Plus size={18} /> Tambah Produk
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Sinkronisasi Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ikan</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Harga</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="" />
                          <span className="font-black text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-6 font-black text-slate-700">Rp {p.pricePerKg.toLocaleString("id-ID")}</td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                          <Link 
                            href={`/admin/products/edit/${p.id}`} 
                            className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              Belum ada ikan yang mendarat di database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}