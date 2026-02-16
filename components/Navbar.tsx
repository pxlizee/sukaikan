"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag, LogOut, LogIn, LayoutDashboard, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Daftar Menu Navigasi
  const navLinks = [
    { name: "Belanja", href: "/shop" },
    { name: "Lacak Pesanan", href: "/orders" }, // Nanti kita buat halamannya
    { name: "Mengapa Pre-order?", href: "/about" }, // Halaman edukasi
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* 1. LOGO & HAMBURGER (Mobile) */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
              SUKAIKAN<span className="text-slate-900">.</span>
            </Link>
          </div>

          {/* 2. MENU TENGAH (Desktop Only) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. ICON KANAN (Cart & User) */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Tombol Dashboard Admin */}
            {isAdmin && (
              <Link href="/admin/products" className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition">
                <LayoutDashboard size={14} /> Dash
              </Link>
            )}

            {/* Keranjang */}
            <Link href="/checkout" className="relative p-2 hover:bg-slate-100 rounded-full transition group">
              <ShoppingBag size={20} className="text-slate-600 group-hover:text-blue-600 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {session ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400">Halo,</p>
                  <p className="text-xs font-bold text-slate-900">
                    {session.user?.name?.split(" ")[0]}
                  </p>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                <LogIn size={14} /> Masuk
              </Link>
            )}
          </div>
        </div>

        {/* 4. MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 space-y-4 pb-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="block text-sm font-bold text-slate-600 hover:text-blue-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)} // Tutup menu pas diklik
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/products" className="block text-sm font-bold text-slate-900 py-2">
                Dashboard Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}