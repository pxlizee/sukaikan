"use client";
import { useCart } from '../../../lib/CartContext';
import Link from 'next/link';
import { Trash2, MessageSquare } from "lucide-react";

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum: number, item: any) => sum + (item.pricePerKg * item.qty), 0);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-10 text-slate-900">Keranjang Belanja 🛒</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold mb-5">Keranjangmu masih kosong nih...</p>
            <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Cari Ikan Segar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List Item */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-3xl bg-white shadow-sm">
                  <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">Qty: {item.qty} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">Rp {(item.pricePerKg * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-rose-500 font-bold text-sm flex items-center gap-2 mt-4 hover:underline">
                <Trash2 size={16} /> Kosongkan Keranjang
              </button>
            </div>

            {/* Ringkasan Bayar */}
            <div className="bg-slate-900 text-white p-8 rounded-[40px] h-fit sticky top-24">
              <h3 className="text-xl font-black mb-6">Ringkasan</h3>
              <div className="flex justify-between mb-4 font-medium text-slate-400">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-8 pt-4 border-t border-slate-800">
                <span className="font-black text-xl">Total</span>
                <span className="font-black text-xl text-blue-400">Rp {total.toLocaleString()}</span>
              </div>
              
              {/* Tombol Order via WhatsApp (Paling pas buat P2MW) */}
              <a 
                href={`https://wa.me/628123456789?text=Halo SUKAIKAN, saya mau pesan: ${cart.map((i:any) => `${i.name} (${i.qty}kg)`).join(', ')}. Total: Rp ${total.toLocaleString()}`}
                target="_blank"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"
              >
                <MessageSquare size={16} /> Pesan via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}