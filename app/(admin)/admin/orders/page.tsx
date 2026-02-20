"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search, Package, Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Fungsi Ambil Data Semua Pesanan
  const fetchOrders = async () => {
    try {
      // Catatan: Pastikan kamu punya endpoint ini untuk narik SEMUA pesanan
      const res = await fetch("/api/admin/orders"); 
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Fungsi Update Status (Sesuai yang kita bahas tadi)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("✅ Status pesanan berhasil diubah!");
        fetchOrders(); // Refresh data di tabel tanpa reload browser
      } else {
        alert("❌ Gagal mengubah status pesanan.");
      }
    } catch (error) {
      alert("❌ Terjadi kesalahan jaringan saat menghubungi server.");
    }
  };

  // Fitur pencarian berdasarkan Nama atau ID Order
  const filteredOrders = orders.filter((o) => 
    o.customerName?.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Kelola Pesanan</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Pantau dan perbarui status pengiriman pelanggan.
          </p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-8 flex items-center gap-3">
          <Search size={20} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Cari nama pelanggan atau ID pesanan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-700 focus:outline-none placeholder:font-medium"
          />
        </div>

        {/* --- DAFTAR PESANAN --- */}
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-black uppercase tracking-widest text-xs">Memuat Data Pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center">
              <Package size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Belum ada pesanan yang masuk.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID & Waktu</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pelanggan</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Belanja</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status Pengiriman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Kolom 1: ID & Tanggal */}
                      <td className="p-6">
                        <p className="font-black text-slate-900 text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </td>

                      {/* Kolom 2: Info Pelanggan */}
                      <td className="p-6">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">{order.customerPhone}</p>
                      </td>

                      {/* Kolom 3: Total Harga */}
                      <td className="p-6 font-black text-slate-700">
                        Rp {order.totalPrice?.toLocaleString("id-ID")}
                      </td>

                      {/* Kolom 4: DROPDOWN STATUS (Kode dari kamu) */}
                      <td className="p-6">
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
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}