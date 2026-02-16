import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. Import Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sukaikan - Seafood Segar",
  description: "Marketplace ikan segar langsung dari nelayan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          
          {/* 2. Pasang Footer di bawah children */}
          <main className="min-h-screen">
             {children}
          </main>
          
          <Footer /> 
        </Providers>
      </body>
    </html>
  );
}