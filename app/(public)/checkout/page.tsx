"use client";

import { useCart } from "@/lib/CartContext";
import { useSession } from "next-auth/react"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ArrowLeft, Loader2, Trash2, QrCode, CreditCard, Smartphone, X } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart(); 
  const { data: session } = useSession(); 
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  // State untuk kontrol Popup Simulasi Pembayaran
  const [showPaymentMockup, setShowPaymentMockup] = useState(false);
  const [isProcessingMock, setIsProcessingMock] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

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
        if (result.snapToken) {
          // MODE MIDTRANS ASLI
          // @ts-ignore
          window.snap.pay(result.snapToken, {
            onSuccess: function () {
              alert("Pembayaran Berhasil!");
              clearCart(); 
              router.push("/orders");
            },
            onPending: function () {
              alert("Menunggu pembayaran Anda!");
              clearCart();
              router.push("/orders");
            },
            onError: function () {
              alert("Pembayaran Gagal!");
              setIsLoading(false);
            },
            onClose: function () {
              alert("Anda menutup popup sebelum membayar");
              setIsLoading(false);
            },
          });
        } else {
          // MODE SIMULASI: Munculkan UI Mockup kita
          setCreatedOrderId(result.orderId); // Simpan ID pesanan yang baru dibuat (kalau mau dipakai nanti)
          setIsLoading(false);
          setShowPaymentMockup(true);
        }
      } else {
        alert("Gagal memproses pesanan: " + result.error);
        setIsLoading(false);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat menghubungi server");
      setIsLoading(false);
    }
  };

  // Fungsi saat user memilih metode pembayaran di Mockup
  const handleMockPayment = async (method: string) => {
    setIsProcessingMock(true); // Mulai efek loading
    
    try {
      // 1. Tembak API untuk ubah status jadi PAID (Lunas) di database
      if (createdOrderId) {
        await fetch(`/api/orders/${createdOrderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        });
      }

      // 2. Simulasi delay jaringan (1.5 detik) biar kelihatan real
      setTimeout(() => {
        alert(`✅ Pembayaran via ${method} Berhasil disimulasikan!`);
        setShowPaymentMockup(false);
        setIsProcessingMock(false);
        clearCart();
        router.push("/orders");
      }, 1500);

    } catch (error) {
      alert("Waduh, gagal ngabarin database nih!");
      setIsProcessingMock(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-6 font-sans relative">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/shop" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Kembali Belanja
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Pengiriman */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">📍 Informasi Pengiriman</h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Nama Penerima</label>
                    <input name="customerName" required defaultValue={session?.user?.name || ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">WhatsApp</label>
                    <input name="customerPhone" required type="tel" placeholder="0812..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Alamat Lengkap</label>
                  <textarea name="address" required rows={3} placeholder="Jalan, Nomor Rumah, RT/RW..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-blue-500 transition" />
                </div>
              </form>
            </div>

            {/* Isi Keranjang */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-black text-slate-900">📦 Isi Keranjang</h2>
                 <span className="text-xs font-bold text-slate-400">{cart.length} Item</span>
               </div>
               <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 font-bold">NO IMG</div>}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400 font-medium">Rp {(item.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} className="p-2 hover:bg-white rounded-lg transition shadow-sm disabled:opacity-50"><Minus size={12}/></button>
                        <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><Plus size={12}/></button>
                      </div>
                      <button type="button" onClick={() => { if(confirm("Hapus ikan ini?")) removeFromCart(item.id); }} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition shadow-sm" title="Hapus Item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
               </div>
            </div>
          </div>

          {/* Rincian Harga */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-[32px] p-8 sticky top-24 shadow-2xl shadow-slate-900/20">
              <h3 className="font-black uppercase tracking-widest text-xs mb-8 text-slate-400">Rincian Tagihan</h3>
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
                <span className="text-sm font-bold text-slate-300">Total</span>
                <span className="text-3xl font-black text-blue-400">Rp {total.toLocaleString()}</span>
              </div>
              
              <button 
                form="checkout-form"
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/50 hover:shadow-blue-600/50 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOCKUP PAYMENT POPUP (UI SIMULASI) --- */}
      {showPaymentMockup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl transform transition-all">
            
            {/* Header Popup */}
            <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900">Sukaikan Payment</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pilih Metode</p>
              </div>
              <button onClick={() => setShowPaymentMockup(false)} className="text-slate-400 hover:text-rose-500 transition bg-white p-2 rounded-full shadow-sm">
                <X size={20}/>
              </button>
            </div>

            {/* Total Tagihan di Popup */}
            <div className="p-6 text-center border-b border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-1">Total Pembayaran</p>
              <p className="text-2xl font-black text-blue-600">Rp {total.toLocaleString()}</p>
            </div>

            {/* Pilihan Pembayaran */}
            <div className="p-6 space-y-3 relative">
              {/* Overlay Loading saat proses dipencet */}
              {isProcessingMock && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-b-[32px]">
                  <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                  <p className="font-bold text-slate-700 text-sm animate-pulse">Memproses Pembayaran...</p>
                </div>
              )}

              <button onClick={() => handleMockPayment('QRIS')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition"><QrCode size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">QRIS (Scan Barcode)</p>
                  <p className="text-xs text-slate-400 font-medium">BCA, GoPay, OVO, Dana</p>
                </div>
              </button>

              <button onClick={() => handleMockPayment('Transfer Bank')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition"><CreditCard size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Transfer Bank</p>
                  <p className="text-xs text-slate-400 font-medium">Virtual Account</p>
                </div>
              </button>

              <button onClick={() => handleMockPayment('E-Wallet')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition"><Smartphone size={20} /></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">E-Wallet</p>
                  <p className="text-xs text-slate-400 font-medium">ShopeePay, LinkAja</p>
                </div>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}