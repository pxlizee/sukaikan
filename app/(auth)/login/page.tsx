"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Panggil NextAuth untuk login
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email atau password salah!");
      setLoading(false);
    } else {
      // Login berhasil, lempar ke home atau halaman sebelumnya
      router.push("/");
      router.refresh(); // Refresh biar header berubah jadi nama user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Selamat Datang</h1>
          <p className="text-slate-400 text-sm font-medium">Masuk untuk mengelola pesanan Anda.</p>
        </div>

        {/* Notifikasi kalau baru sukses daftar */}
        {registered && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl text-center flex items-center justify-center gap-2">
            ✅ Akun berhasil dibuat! Silakan login.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="budi@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Masuk Akun"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 font-black hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}