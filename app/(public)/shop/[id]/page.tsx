"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft, ShoppingCart, Minus, Plus, Loader2, CheckCircle2, ShieldCheck, Ship, Anchor } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Ambil data ikan spesifik dari database
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Produk tidak ditemukan");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Gagal memuat detail produk");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  // Fungsi Masukkan ke Keranjang
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: qty,
    });

    // Efek tombol sukses
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push("/shop"); // Lempar balik ke toko setelah sukses (opsional)
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-black uppercase tracking-widest text-xs text-slate-400">Menyiapkan Ikan...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Ikan Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">Mungkin ikannya sudah berenang jauh.</p>
        <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs">
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-blue-600 transition">
          <ArrowLeft size={16} /> Katalog Produk
        </Link>

        <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* KIRI: Foto Ikan */}
            <div className="relative aspect-square rounded-[32px] bg-slate-100 overflow-hidden border border-slate-100">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black flex-col gap-2">
                  <Anchor size={48} className="opacity-50" />
                  NO IMG
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm">
                {product.category}
              </div>
            </div>

            {/* KANAN: Detail & Aksi */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                {product.name}
              </h1>
              
              <div className="text-3xl font-black text-blue-600 mb-6">
                Rp {product.price?.toLocaleString("id-ID")} <span className="text-sm text-slate-400 font-medium">/ kg</span>
              </div>

              {/* Deskripsi */}
              <div className="mb-8">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Deskripsi Ikan</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {product.description || "Ikan segar tangkapan nelayan lokal. Sangat cocok untuk berbagai macam olahan masakan keluarga Anda. Kesegaran terjamin 100%!"}
                </p>
              </div>

              {/* Keunggulan (Gimmick UI biar keren) */}
              <div className="flex gap-4 mb-10 border-y border-slate-100 py-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <ShieldCheck className="text-green-500" size={18} /> Kualitas Premium
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Ship className="text-blue-500" size={18} /> Langsung dari Nelayan
                </div>
              </div>

              {/* Kontrol Jumlah & Tombol Keranjang */}
              {product.isAvailable ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                  {/* Plus Minus Qty */}
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full sm:w-auto justify-between">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-3 hover:bg-white rounded-xl transition shadow-sm bg-white text-slate-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-black text-lg w-8 text-center">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="p-3 hover:bg-white rounded-xl transition shadow-sm bg-white text-slate-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Tombol Add to Cart */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                      isAdded 
                        ? "bg-green-500 text-white shadow-lg shadow-green-200" 
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30"
                    }`}
                  >
                    {isAdded ? (
                      <><CheckCircle2 size={18} /> Berhasil Ditambah</>
                    ) : (
                      <><ShoppingCart size={18} /> Tambah ke Keranjang</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 text-rose-600 text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-rose-100">
                  Mohon Maaf, Ikan Sedang Kosong / Habis
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}