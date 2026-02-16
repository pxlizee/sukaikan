"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // Di Client Component ini masih aman
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "", 
    price: "", 
    category: "Ikan Laut", 
    description: "", 
    imageUrl: "",
  });

  // 1. Ambil data produk lama
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Gagal ambil data");
        
        const data = await res.json();
        setFormData({
          name: data.name,
          price: data.price.toString(), // Sesuaikan dengan field 'price' di schema
          category: data.category,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        setStatus("❌ Gagal memuat data produk");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) loadProduct();
  }, [params.id]);

  // 2. Fungsi Upload Cloudinary
  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "ISI_CLOUD_NAME_KAMU", // Ganti dengan Cloud Name-mu
        uploadPreset: "sukaikan_upload", // Ganti dengan Preset-mu
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setFormData((prev) => ({ ...prev, imageUrl: result.info.secure_url }));
          setStatus("✅ Foto berhasil diupload!");
        }
      }
    );
    widget.open();
  };

  // 3. Simpan Perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("Sedang menyimpan...");

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price) // Pastikan dikirim sebagai angka (Int)
        }),
      });

      if (res.ok) {
        setStatus("✅ Berhasil diperbarui!");
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setStatus("❌ Gagal menyimpan perubahan");
      }
    } catch (error) {
      setStatus("❌ Terjadi kesalahan koneksi");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Menyiapkan Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" />
      
      <div className="max-w-xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-blue-600 transition">
          <ArrowLeft size={16} /> Batal & Kembali
        </Link>

        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Edit Ikan</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Perbarui informasi produk di sini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Nama Ikan</label>
              <input 
                value={formData.name}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:outline-blue-500"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Harga /kg</label>
              <input 
                value={formData.price}
                type="number" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:outline-blue-500"
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Foto Produk</label>
              <div 
                onClick={handleUpload} 
                className="relative h-48 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all flex flex-col items-center justify-center group"
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <p className="text-white text-xs font-black uppercase">Ganti Foto</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <ImagePlus className="text-slate-300 mx-auto mb-2" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Upload Foto</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Deskripsi</label>
              <textarea 
                value={formData.description}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 h-32 font-medium text-slate-600 focus:outline-blue-500"
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            
            {status && (
              <p className="text-center text-xs font-black uppercase tracking-tighter text-blue-600">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}