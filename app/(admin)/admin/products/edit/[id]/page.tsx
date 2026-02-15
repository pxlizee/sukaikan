"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "", price: "", category: "Ikan Laut", description: "", imageUrl: "",
  });

  // 1. Ambil data produk lama saat halaman dibuka
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        setFormData({
          name: data.name,
          price: data.pricePerKg.toString(),
          category: data.category,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        setStatus("❌ Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
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
        }
      }
    );
    widget.open();
  };

  // 3. Simpan Perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("Menyimpan perubahan...");

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("✅ Berhasil diupdate!");
        setTimeout(() => router.push("/admin/products"), 1500);
      }
    } catch (error) {
      setStatus("❌ Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center font-black">MEMUAT DATA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" />
      
      <div className="max-w-xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm mb-6 hover:text-blue-600 transition">
          <ArrowLeft size={16} /> Batal & Kembali
        </Link>

        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Edit Produk</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              value={formData.name}
              placeholder="Nama Ikan" 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
            
            <input 
              value={formData.price}
              type="number" 
              placeholder="Harga /kg" 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              required 
            />

            {/* Area Foto */}
            <div onClick={handleUpload} className="relative h-40 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="text-slate-300" />
              )}
            </div>

            <textarea 
              value={formData.description}
              placeholder="Deskripsi" 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 h-32"
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
            
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            
            {status && <p className="text-center font-bold text-blue-600 animate-pulse">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}