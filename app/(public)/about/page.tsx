"use client";

import { Fish, ShieldCheck, Ship, Leaf, ArrowRight, Anchor } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const reasons = [
    {
      icon: <Fish className="text-blue-600" size={32} />,
      title: "Kesegaran 100% Terjamin",
      desc: "Berbeda dengan pasar yang ikannya mungkin sudah berhari-hari di es, ikan kami baru ditangkap setelah Anda memesan. Segar dari laut langsung ke dapur Anda."
    },
    {
      icon: <Ship className="text-blue-600" size={32} />,
      title: "Mendukung Nelayan Lokal",
      desc: "Sistem pre-order memastikan nelayan mendapatkan harga yang adil tanpa potongan tengkulak yang besar. Anda membeli, Anda memberdayakan ekonomi pesisir."
    },
    {
      icon: <Leaf className="text-blue-600" size={32} />,
      title: "Zero Waste (Ramah Lingkungan)",
      desc: "Dengan pre-order, tidak ada ikan yang terbuang sia-sia karena tidak laku. Nelayan hanya mengambil apa yang dibutuhkan, menjaga ekosistem laut tetap seimbang."
    },
    {
      icon: <ShieldCheck className="text-blue-600" size={32} />,
      title: "Kualitas Ekspor",
      desc: "Kami melakukan seleksi ketat. Hanya ikan kualitas terbaik yang kami kirimkan untuk memastikan kepuasan Anda dalam setiap hidangan."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10"><Anchor size={120} className="text-white" /></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block">
            The Sukaikan Way
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Mengapa Kami Memilih <span className="text-blue-500">Pre-Order?</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            Kami tidak sekadar menjual ikan. Kami menghubungkan Anda dengan laut melalui cara yang paling segar, adil, dan berkelanjutan.
          </p>
        </div>
      </section>

      {/* --- GRID ALASAN --- */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((item, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ALUR KERJA --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Bagaimana Ini Bekerja?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative z-10">
              <span className="text-5xl font-black text-blue-50/50 absolute top-4 right-8 italic">01</span>
              <h4 className="font-black text-slate-900 mb-2">Anda Memesan</h4>
              <p className="text-sm text-slate-500 font-medium">Pilih ikan favorit Anda sebelum hari Kamis setiap minggunya.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative z-10">
              <span className="text-5xl font-black text-blue-50/50 absolute top-4 right-8 italic">02</span>
              <h4 className="font-black text-slate-900 mb-2">Nelayan Melaut</h4>
              <p className="text-sm text-slate-500 font-medium">Jumat pagi nelayan kami melaut untuk mengambil tangkapan sesuai pesanan.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative z-10">
              <span className="text-5xl font-black text-blue-50/50 absolute top-4 right-8 italic">03</span>
              <h4 className="font-black text-slate-900 mb-2">Sabtu Sampai</h4>
              <p className="text-sm text-slate-500 font-medium">Sabtu pagi ikan segar tiba di depan pintu rumah Anda. Siap dimasak!</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6 bg-blue-600 rounded-[48px] py-16 shadow-2xl shadow-blue-200">
          <h2 className="text-3xl font-black text-white mb-6">Siap Menikmati Ikan Segar?</h2>
          <p className="text-blue-100 mb-10 font-medium">Jangan lewatkan slot pengiriman Sabtu ini. Pesan sekarang sebelum kuota penuh!</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
          >
            Mulai Belanja <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}