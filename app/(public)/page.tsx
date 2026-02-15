import { prisma } from '../../lib/prisma'
import Link from "next/link";
import { Sparkles, ChevronDown, Info } from "lucide-react";
import AddToCartButton from '../../components/AddToCartButton';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Stok Segar Hari Ini
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-4">
              Pilih Ikanmu, <br />Biar AI yang <span className="text-blue-600">Kasih Resep.</span>
            </h1>
            <p className="text-slate-500 font-medium">Semua produk diambil langsung dari pelelangan ikan lokal setiap jam 5 pagi untuk menjamin kualitas terbaik.</p>
          </div>
          
          <div className="hidden md:block bg-blue-600 p-6 rounded-[32px] text-white shadow-xl shadow-blue-200 max-w-xs rotate-3">
            <Info className="mb-4 opacity-50" />
            <p className="font-bold leading-tight">Gratis biaya vakum dan es batu untuk setiap pembelian di atas 2kg!</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Ikan+Segar'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.name}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-full shadow-sm border border-white uppercase tracking-widest">
                      {product.category || "Segar"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium line-clamp-2 italic mb-6">
                    "{product.description}"
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-slate-900">
                      Rp {product.pricePerKg.toLocaleString("id-ID")}
                    </span>
                    <span className="text-slate-400 font-bold text-sm uppercase">/kg</span>
                  </div>

                  {/* Recipe Accordion */}
                  <details className="group/details">
                    <summary className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors list-none">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-white rounded-lg shadow-sm">✨</span>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Lihat Ide Masak AI</span>
                      </div>
                      <ChevronDown size={18} className="text-slate-400 group-open/details:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm text-slate-700 leading-relaxed">
                      <div className="whitespace-pre-line font-medium italic">
                        {product.recipeText || "Sabar ya, AI sedang mencari bumbu yang pas..."}
                      </div>
                    </div>
                  </details>
                </div>

                {/* Button */}
                <div className="p-8">
                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-6">⛵</div>
            <h2 className="text-2xl font-black text-slate-800">Kapal Belum Berlabuh</h2>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">Saat ini belum ada ikan yang tersedia. Silakan hubungi admin untuk info stok.</p>
            <Link href="/admin/products/add" className="mt-8 inline-block text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">
              Masuk Sebagai Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
