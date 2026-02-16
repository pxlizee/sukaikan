"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, ChevronDown, Search } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders"); // Panggil API Admin tadi
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if(!confirm(`Ubah status jadi ${newStatus}?`)) return;

    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    if (res.ok) {
      fetchOrders(); // Refresh data
    } else {
      alert("Gagal update status");
    }
  };

  // Filter pencarian berdasarkan Nama Customer atau Order ID
  const filteredOrders = orders.filter((o: any) => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) || 
    o.id.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Kelola Pesanan Masuk</h1>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-8 flex items-center gap-3">
          <Search size={20} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Cari nama pembeli atau ID pesanan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-700 focus:outline-none placeholder:font-medium"
          />
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              
              {/* Header: Info Customer */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 border-b border-slate-50 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">#{order.id.slice(-6)}</span>
                    <span className="text-sm font-bold text-slate-400">
                       {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{order.customerName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{order.customerPhone}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">{order.address}</p>
                </div>

                {/* Kontrol Status */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`appearance-none pl-4 pr-10 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 focus:outline-none cursor-pointer transition ${
                        order.status === "PENDING" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                        order.status === "PAID" ? "border-blue-200 bg-blue-50 text-blue-700" :
                        order.status === "SHIPPED" ? "border-purple-200 bg-purple-50 text-purple-700" :
                        "border-green-200 bg-green-50 text-green-700"
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Lunas</option>
                      <option value="SHIPPED">Dikirim</option>
                      <option value="COMPLETED">Selesai</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
                  </div>
                </div>
              </div>

              {/* List Item */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                         <span className="font-bold text-slate-700">{item.productName}</span>
                         <span className="text-slate-400 text-xs">x {item.quantity}</span>
                      </div>
                      <span className="font-medium text-slate-600">Rp {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Pendapatan</span>
                  <span className="text-lg font-black text-blue-600">Rp {order.totalPrice.toLocaleString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}