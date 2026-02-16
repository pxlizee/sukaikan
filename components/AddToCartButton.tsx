"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAction = () => {
    if (!product.isAvailable) return;
    
    // Pastikan properti yang dikirim adalah 'price'
    addToCart({
      ...product,
      price: product.price || 0 // Paksa jadi 0 kalau undefined biar gak NaN
    });
    
    router.push("/checkout"); // Langsung ke checkout
  };

  return (
    <button
      onClick={handleAction}
      disabled={!product.isAvailable}
      className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
        product.isAvailable 
          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100" 
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
      }`}
    >
      <ShoppingCart size={16} />
      {product.isAvailable ? "Pesan Sekarang" : "Stok Habis"}
    </button>
  );
}