"use client";

import { useCart } from "@/lib/CartContext";
import { useSession } from "next-auth/react"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ArrowLeft, Loader2, Trash2 } from "lucide-react"; // Tambah Trash2
import Link from "next/link";

export default function CheckoutPage() {
  // Tambahkan removeFromCart di sini
  const { cart, updateQty, removeFromCart } = useCart(); 
  const { data: session } = useSession(); 
  const [isLoading, setIsLoading] = useState(false);

  // Hitung total
  const subtotal = cart.reduce((sum: number, item: any) => sum + ((item.price || 0) * item.qty), 0);
  const shippingFee = 15000;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      userId: (session?.user as any)?.id, 
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      address: formData.get("address"),
      items: cart,
      total: total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Pesanan Berhasil Disimpan! ID: " + result.orderId);
        window.location.href = "/"; 
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Keranjang Kosong</h1>
        <p className="text-slate-500 mb-8">Wah, belum ada ikan yang ditangkap nih.</p>
        <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition">
          Belanja Dulu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Kembali Belanja
          </Link>
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
            User: {session?.user?.name || "Tamu"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Kiri: Form & Items */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Form Pengiriman */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                📍 Alamat Pengiriman
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Nama Penerima</label>
                    <input 
                      name="customerName" 
                      required 
                      defaultValue={session?.user?.name || ""} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">WhatsApp</label>
                    <input 
                      name="customerPhone" 
                      required 
                      type="tel"
                      placeholder="0812..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Alamat Lengkap</label>
                  <textarea 
                    name="address" 
                    required 
                    rows={3}
                    placeholder="Jalan, Nomor Rumah, RT/RW..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition"
                  />
                </div>
              </form>
            </div>

            {/* List Barang */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-black text-slate-900">📦 Isi Paket</h2>
                 <span className="text-xs font-bold text-slate-400">{cart.length} Item</span>
               </div>
               
               <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 font-bold">NO IMG</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400 font-medium">Rp {(item.price || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Kontrol Jumlah */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)} 
                          className="p-2 hover:bg-white rounded-lg transition shadow-sm disabled:opacity-50"
                          disabled={item.qty <= 1} // Disable kalau sisa 1 (biar gak minus)
                        >
                          <Minus size={12}/>
                        </button>
                        <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)} 
                          className="p-2 hover:bg-white rounded-lg transition shadow-sm"
                        >
                          <Plus size={12}/>
                        </button>
                      </div>

                      {/* --- TOMBOL HAPUS BARU --- */}
                      <button 
                        onClick={() => {
                          if(confirm("Hapus ikan ini dari keranjang?")) {
                            removeFromCart(item.id);
                          }
                        }}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition shadow-sm"
                        title="Hapus Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
               </div>
            </div>
          </div>

          {/* Kanan: Ringkasan & Tombol Bayar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-[32px] p-8 sticky top-24 shadow-2xl shadow-slate-900/20">
              <h3 className="font-black uppercase tracking-widest text-xs mb-8 text-slate-400">Rincian Biaya</h3>
              <div className="space-y-4 mb-8 border-b border-slate-700 pb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Subtotal</span>
                  <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Ongkir (Flat)</span>
                  <span className="font-bold">Rp {shippingFee.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold text-slate-300">Total Tagihan</span>
                <span className="text-3xl font-black text-blue-400">Rp {total.toLocaleString()}</span>
              </div>
              
              <button 
                form="checkout-form"
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/50 hover:shadow-blue-600/50 translate-y-0 hover:-translate-y-1"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}