"use client";
import { useCart } from '../lib/CartContext';
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  return (
    <button 
      onClick={() => {
        addToCart(product);
        alert(`${product.name} masuk keranjang!`);
      }}
      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
    >
      <ShoppingCart size={16} /> Tambahkan ke Keranjang
    </button>
  );
}