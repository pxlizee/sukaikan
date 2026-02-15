"use client";
import './globals.css'
import { CartProvider, useCart } from '../lib/CartContext'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
// 1. Import komponen Script dari Next.js
import Script from 'next/script' 

// Komponen Navbar Kecil
function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          SUKAIKAN<span className="text-slate-400">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/shop" className="font-bold text-sm text-slate-600 hover:text-blue-600">Katalog</Link>
          <Link href="/cart" className="relative p-2 bg-slate-100 rounded-full hover:bg-blue-50 transition-colors group">
            <ShoppingBag size={20} className="text-slate-600 group-hover:text-blue-600" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>

        {/* 2. Tambahkan script ini di bawah CartProvider */}
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  )
}