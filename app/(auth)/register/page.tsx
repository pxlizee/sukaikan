"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect ke halaman login setelah berhasil
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Gagal mendaftar");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Buat Akun Baru</h1>
          <p className="text-slate-400 text-sm font-medium">Gabung untuk mulai memesan ikan segar.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Nama Lengkap</label>
            <input 
              name="name" 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-2">Alamat Email</label>
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
              minLength={6}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="******"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Daftar Sekarang <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-black hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}