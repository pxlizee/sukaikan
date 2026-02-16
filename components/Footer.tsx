import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* KOLOM 1: BRANDING */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white tracking-tighter">
            SUKAIKAN<span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Platform pre-order seafood segar langsung dari nelayan lokal. 
            Kualitas terbaik, harga transparan, dan mendukung ekonomi pesisir.
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="#" className="hover:text-white transition"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-white transition"><Facebook size={20} /></Link>
            <Link href="#" className="hover:text-white transition"><Twitter size={20} /></Link>
          </div>
        </div>

        {/* KOLOM 2: NAVIGASI */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Pelanggan</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link href="/shop" className="hover:text-blue-400 transition">Belanja Ikan</Link></li>
            <li><Link href="/orders" className="hover:text-blue-400 transition">Cek Status Pesanan</Link></li>
            <li><Link href="/about" className="hover:text-blue-400 transition">Mengapa Pre-order?</Link></li>
            <li><Link href="/register" className="hover:text-blue-400 transition">Daftar Akun</Link></li>
          </ul>
        </div>

        {/* KOLOM 3: KONTAK (PENTING BUAT KEPERCAYAAN) */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Hubungi Kami</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 shrink-0" />
              <span>Jl. Ambatukam No. 666, Ngawi, Jawa Timur</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <span>halo@sukaikan.com</span>
            </li>
          </ul>
        </div>

        {/* KOLOM 4: JAM OPERASIONAL */}
        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Jadwal Pengiriman</h3>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pre-order Dibuka:</p>
            <p className="text-white font-bold mb-3">Senin - Kamis</p>
            
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pengiriman:</p>
            <p className="text-blue-400 font-bold">Setiap Sabtu Pagi</p>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        &copy; 2026 Sukaikan P2MW Project. Made with ❤️ by Atmin Sukaikan.
      </div>
    </footer>
  );
}