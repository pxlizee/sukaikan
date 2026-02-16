"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, ChevronRight, Loader2 } from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
          <Package size={32} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Belum Ada Pesanan</h1>
        <p className="text-slate-500 mb-8 max-w-xs">Kamu belum pernah belanja ikan di sini. Yuk coba pesan sekarang!</p>
        <Link href="/shop" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Riwayat Pesanan</h1>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
              
              {/* Header Kartu Pesanan */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-50 pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Badge Status */}
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  order.status === "PENDING" ? "bg-yellow-50 text-yellow-700" :
                  order.status === "PAID" ? "bg-blue-50 text-blue-700" :
                  order.status === "SHIPPED" ? "bg-purple-50 text-purple-700" :
                  "bg-green-50 text-green-700"
                }`}>
                  {order.status === "PENDING" && <Clock size={14} />}
                  {order.status === "PAID" && <CheckCircle size={14} />}
                  {order.status === "SHIPPED" && <Truck size={14} />}
                  {order.status}
                </div>
              </div>

              {/* List Barang */}
              <div className="space-y-3 mb-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      <span className="font-bold text-slate-700">{item.productName}</span>
                      <span className="text-slate-400 text-xs">x {item.quantity}</span>
                    </div>
                    <span className="font-medium text-slate-500">Rp {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Footer Total */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Tagihan</span>
                <span className="text-lg font-black text-blue-600">Rp {order.totalPrice.toLocaleString()}</span>
              </div>

              {/* Tombol Bayar (Kalau masih Pending) */}
              {order.status === "PENDING" && (
                <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition">
                  Bayar Sekarang
                </button>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}