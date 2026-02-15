"use client";

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  ShoppingBag 
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

// Data Simulasi untuk Grafik (Biar Langsung Cantik saat Demo)
const salesData = [
  { name: 'Sen', sales: 1200000 },
  { name: 'Sel', sales: 1800000 },
  { name: 'Rab', sales: 1500000 },
  { name: 'Kam', sales: 2900000 },
  { name: 'Jum', sales: 2100000 },
  { name: 'Sab', sales: 4500000 },
  { name: 'Min', sales: 3800000 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 font-medium">Selamat datang kembali, Admin SUKAIKAN.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">
              Unduh Laporan
            </button>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              + Batch Baru
            </button>
          </div>
        </div>

        {/* Stats Grid (4 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value="Rp 15.420.000" 
            icon={<DollarSign size={20} className="text-blue-600" />} 
            trend="+12.5%" 
            isPositive={true}
          />
          <StatCard 
            title="Pesanan Masuk" 
            value="124" 
            icon={<ShoppingBag size={20} className="text-indigo-600" />} 
            trend="+18" 
            isPositive={true}
          />
          <StatCard 
            title="Pelanggan Aktif" 
            value="89" 
            icon={<Users size={20} className="text-emerald-600" />} 
            trend="+4" 
            isPositive={true}
          />
          <StatCard 
            title="Stok Tersedia" 
            value="452 Kg" 
            icon={<Package size={20} className="text-orange-600" />} 
            trend="-5% Stok" 
            isPositive={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section (2/3 lebar) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-800">Analitik Penjualan</h3>
                <p className="text-sm text-slate-400 font-medium">Performa minggu ini</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg shadow-sm text-xs font-bold">Mingguan</button>
                <button className="text-slate-400 px-4 py-1.5 text-xs font-bold">Bulanan</button>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    tickFormatter={(value) => `Rp ${value/1000000}jt`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: '800', color: '#2563eb' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity (1/3 lebar) */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-8">Order Terbaru</h3>
            <div className="space-y-6">
              <OrderRow name="Ahmad Zaki" fish="Ikan Kakap" price="Rp 125.000" status="Dikirim" />
              <OrderRow name="Siska Putri" fish="Udang Vaname" price="Rp 85.000" status="Proses" />
              <OrderRow name="Budi Doremi" fish="Ikan Tongkol" price="Rp 45.000" status="Selesai" />
              <OrderRow name="Rahmat H." fish="Cumi-cumi" price="Rp 210.000" status="Dibayar" />
              <OrderRow name="Lina Marlina" fish="Ikan Nila" price="Rp 60.000" status="Selesai" />
            </div>
            <button className="w-full mt-10 py-4 border-2 border-slate-50 text-slate-400 rounded-2xl font-bold text-sm hover:border-blue-100 hover:text-blue-600 transition">
              Lihat Semua Transaksi
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Komponen Kecil: Kartu Statistik
function StatCard({ title, value, icon, trend, isPositive }: any) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3.5 bg-slate-50 rounded-2xl">{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <TrendingUp size={12} /> : <Clock size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// Komponen Kecil: Baris Pesanan
function OrderRow({ name, fish, price, status }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{fish}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-slate-800">{price}</p>
        <p className={`text-[10px] font-black uppercase ${
          status === 'Selesai' ? 'text-emerald-500' : 'text-blue-500'
        }`}>{status}</p>
      </div>
    </div>
  );
}