"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/CartContext"; // Kita gabung sekalian biar rapi

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}