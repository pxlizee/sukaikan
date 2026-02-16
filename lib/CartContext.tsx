"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react"; // 1. Import Session

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, newQty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession(); // 2. Ambil data user
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // 3. Tentukan Kunci Penyimpanan Unik
  // Kalau user login, kuncinya: "cart-IDUSER"
  // Kalau tamu (belum login), kuncinya: "cart-guest"
  const userId = (session?.user as any)?.id || "guest";
  const storageKey = `sukaikan-cart-${userId}`;

  // 4. Load Cart saat User Berubah (Ganti Akun)
  useEffect(() => {
    // Cek apakah ada data di local storage untuk user INI
    const savedCart = localStorage.getItem(storageKey);
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Jika tidak ada data tersimpan buat user ini, kosongkan keranjang
      // (Penting: Biar keranjang user sebelumnya tidak 'nyangkut')
      setCart([]);
    }
  }, [userId, storageKey]); // Jalan setiap kali ganti akun

  // 5. Simpan Cart setiap ada perubahan
  useEffect(() => {
    // Kita simpan array kosong juga gapapa, biar status 'kosong' tersimpan
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price || 0, 
        imageUrl: product.imageUrl, 
        qty: 1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    // Hapus juga dari storage biar bersih
    localStorage.removeItem(storageKey);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}