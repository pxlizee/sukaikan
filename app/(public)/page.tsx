import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, Truck, ShieldCheck, ArrowRight, Fish } from 'lucide-react';
import CountdownTimer from '../../components/CountdownTimer';
import AddToCartButton from '../../components/AddToCartButton';

export default async function LandingPage() {
  // Mengambil 3 produk terbaru sebagai "Tangkapan Musiman"
  const seasonalProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { id: 'desc' },
  });

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10">
            <CountdownTimer />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            Segar dari Laut, <br />
            <span className="text-blue-600">Bukan dari Freezer</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Pre-order sekarang untuk pengiriman batch. Kami membeli seafood segar setelah Anda pesan – dijamin kesegaran tanpa waktu freezer.
          </p>
          <Link href="/shop" className="inline-flex px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-105 transition-all gap-3">
            Pesan Sekarang <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* --- CARA KERJA --- */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Cara Kerja</h2>
            <p className="text-slate-400 font-medium italic text-sm">Sistem pre-order kami memastikan Anda mendapatkan seafood paling segar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">1. Anda Pre-Order</h3>
              <p className="text-slate-500 text-sm font-medium">Telusuri dan pesan sebelum batas waktu berakhir</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">2. Kami Beli Segar</h3>
              <p className="text-slate-500 text-sm font-medium">Kami membeli langsung dari nelayan berdasarkan pesanan Anda</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">3. Dikirim ke Anda</h3>
              <p className="text-slate-500 text-sm font-medium">Seafood segar tiba di depan pintu Anda sesuai jadwal</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEKSI TANGKAPAN MUSIMAN (PRODUK UNGGULAN) --- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Tangkapan Musiman</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Segar dan sedang musim minggu ini</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seasonalProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all p-4 flex flex-col">
                <div className="relative h-60 rounded-[32px] overflow-hidden mb-6">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/400'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-black text-slate-800 uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{product.name}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 italic opacity-70">
                    "{product.description}"
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-2xl font-black text-slate-900">Rp {product.price.toLocaleString()}</span>
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">/Kg</span>
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Lihat Semua (Mobile Only) */}
          <div className="mt-12 md:hidden">
            <Link href="/shop" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
              Lihat Katalog Lengkap <ArrowRight size={14} />
            </Link>
          </div>

          {seasonalProducts.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <Fish size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada stok musim ini.</p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}