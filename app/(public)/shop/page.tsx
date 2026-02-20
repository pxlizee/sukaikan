"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Search, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const availableProducts = data.filter((p: any) => p.isAvailable);
        setProducts(availableProducts);
      } catch (error) {
        console.error("Gagal memuat produk");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    });

    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* --- HEADER DENGAN BACKGROUND IMAGE --- */}
      <div className="bg-slate-900 pt-20 pb-24 px-6 relative overflow-hidden">
        
        {/* >>> INI DIA BAGIAN BACKGROUND GAMBARNYA <<< */}
        <div className="absolute inset-0 z-0">
          {/* Ganti URL ini dengan foto laut/nelayan yang kamu punya */}
          <img 
            src="https://picsum.photos/id/1053/1200/400" 
            alt="Background Laut" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          {/* Lapisan gelap (Overlay) biar teks tetap kebaca */}
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        {/* >>> BATAS BACKGROUND GAMBAR <<< */}

        {/* Konten Header (Dibuat z-10 agar di atas gambar) */}
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Katalog Ikan Segar
            </h1>
            <p className="text-blue-200 font-medium">
              Pesan sekarang, tangkap besok, masak lusa.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari ikan apa hari ini?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 transition-all font-bold backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* --- GRID PRODUK (Tidak Ada Perubahan di Sini) --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        {isLoading ? (
          <div className="bg-white rounded-[40px] shadow-sm p-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Memancing Data...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-[40px] shadow-sm p-32 text-center border border-slate-100">
            <p className="text-slate-400 font-bold text-lg">Waduh, ikannya lagi pada sembunyi nih.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                
                {/* Foto Produk (Bisa di-klik ke Detail) */}
                <Link href={`/shop/${p.id}`}>
                  <div className="relative h-48 rounded-[24px] bg-slate-100 overflow-hidden mb-4 cursor-pointer">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-slate-300">NO IMG</div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {p.category}
                    </div>
                  </div>
                </Link>

                {/* Info Produk */}
                <div className="px-2">
                  <h3 className="font-black text-slate-900 text-lg mb-1">{p.name}</h3>
                  <p className="text-blue-600 font-black text-xl mb-4">
                    Rp {p.price?.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-medium">/kg</span>
                  </p>

                  {/* Tombol Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={addedItem === p.id}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                      addedItem === p.id 
                        ? "bg-green-500 text-white shadow-lg shadow-green-200" 
                        : "bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30"
                    }`}
                  >
                    {addedItem === p.id ? (
                      <><CheckCircle2 size={16} /> Ditambahkan</>
                    ) : (
                      <><ShoppingCart size={16} /> + Keranjang</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOAT CART BUTTON */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <Link href="/checkout" className="bg-blue-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-blue-600/50 hover:scale-105 transition-transform">
            <ShoppingCart size={18} />
            Lanjut Bayar ({cart.length} Item)
          </Link>
        </div>
      )}
    </div>
  );
}