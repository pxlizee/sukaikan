"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Link as LinkIcon, Globe } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Ikan Laut",
    description: "",
    imageUrl: "", // Sekarang diisi via link URL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana: pastikan link diawali http/https
    if (!formData.imageUrl.startsWith("http")) {
      return setStatus("❌ Masukkan link gambar yang valid (http/https)");
    }

    setIsLoading(true);
    setStatus("Sedang memproses & AI Gemini... 🍳");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Berhasil disimpan secara online!");
        setTimeout(() => router.push("/admin/products"), 1500);
      }
    } catch (error) {
      setStatus("❌ Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm mb-6 hover:text-slate-600 transition">
          <ArrowLeft size={16} /> Kembali ke Inventaris
        </Link>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Tambah Ikan</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Nama & Harga */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Nama Ikan</label>
                <input
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="Ikan Kakap Merah"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Harga /Kg</label>
                <input
                  type="number"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="85000"
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* INPUT LINK GAMBAR (PENGGANTI UPLOAD) */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Link URL Gambar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <input
                  type="url"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="https://contoh.com/gambar-ikan.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 italic font-medium">
                *Tips: Cari di Google Image, Klik Kanan &gt; Copy Image Address.
              </p>
            </div>

            {/* Preview Gambar Otomatis */}
            {formData.imageUrl && (
              <div className="w-full h-56 rounded-[32px] overflow-hidden border border-slate-100 bg-slate-50 relative group">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Link+Gambar+Tidak+Valid")}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl text-[10px] font-black text-blue-600 uppercase shadow-sm">
                  Live Preview
                </div>
              </div>
            )}

            {/* Deskripsi */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Deskripsi Produk</label>
              <textarea
                className="w-full bg-slate-50 border-none rounded-2xl p-4 h-32 font-medium"
                placeholder="Jelaskan kualitas ikan ini..."
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-[24px] text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-blue-100 ${
                isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              } flex items-center justify-center gap-2`}
            >
              {isLoading ? "Menyimpan..." : <><Sparkles size={16} /> Simpan Produk Online</>}
            </button>

            {status && <p className="text-center text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}