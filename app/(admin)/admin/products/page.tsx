"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Trash2, 
  ClipboardList, // Ikon untuk pesanan
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Loader2, 
  Package 
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Ambil Data Produk
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Gagal mengambil data produk", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Fungsi Hapus Produk
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus ikan ini dari database?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts(); // Refresh data
      } else {
        alert("Gagal menghapus produk");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    }
  };

  // 3. Fungsi Ubah Status Stok
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Gagal update status");
    }
  };

  // Filter Search
  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER DENGAN 2 TOMBOL --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Kelola Produk</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Total {products.length} jenis ikan di database.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Tombol Ke Halaman Order */}
            <Link 
              href="/admin/orders" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg"
            >
              <ClipboardList size={16} /> Lihat Pesanan
            </Link>

            {/* Tombol Tambah Ikan */}
            <Link 
              href="/admin/products/add" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={16} /> Tambah Ikan
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-8 flex items-center gap-3">
          <Search size={20} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Cari nama ikan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-700 focus:outline-none placeholder:font-medium"
          />
        </div>

        {/* Tabel Produk */}
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex justify-center text-slate-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center">
              <Package size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Tidak ada ikan ditemukan.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Produk</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Kategori</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Harga /kg</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Stok</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                    
                    {/* Kolom 1: Gambar & Nama */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {p.imageUrl ? (
                            <img 
                              src={p.imageUrl} 
                              alt={p.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Img";
                                (e.target as HTMLImageElement).onerror = null;
                              }}
                            />
                          ) : (
                            <span className="text-[8px] font-bold text-slate-400 text-center px-1">NO IMG</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400 md:hidden">Rp {(p.price || 0).toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Kategori */}
                    <td className="p-6 hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Kolom 3: Harga */}
                    <td className="p-6 font-black text-slate-700">
                      Rp {(p.price || 0).toLocaleString("id-ID")}
                    </td>

                    {/* Kolom 4: Status Stok (Tombol Toggle) */}
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleToggleStatus(p.id, p.isAvailable)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                          p.isAvailable 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                        }`}
                        title="Klik untuk ubah status"
                      >
                        {p.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {p.isAvailable ? "Tersedia" : "Habis"}
                      </button>
                    </td>

                    {/* Kolom 5: Aksi (Hapus) */}
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(p.id, p.isAvailable)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Refresh Stok"
                        >
                          <RefreshCcw size={16} />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Ikan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}