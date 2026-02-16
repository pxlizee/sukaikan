import { prisma } from '../../../lib/prisma';
import AddToCartButton from '../../../components/AddToCartButton';
import { Fish, AlertCircle } from 'lucide-react';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-12">Katalog Seafood</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm p-4 relative flex flex-col">
              
              {/* Overlay Stok Kosong */}
              <div className="relative h-64 rounded-[32px] overflow-hidden mb-6">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${!product.isAvailable ? 'grayscale opacity-40' : ''}`}
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-rose-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl">
                      Stok Habis
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  {product.category}
                </div>
              </div>

              <div className="px-4 pb-4 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{product.name}</h2>
                <p className="text-slate-400 text-xs font-medium italic mb-6">"{product.description}"</p>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-3xl font-black text-slate-900">Rp {(product.price || 0).toLocaleString()}</span>
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">/Kg</span>
                  </div>

                  {/* Tombol dimatikan jika stok kosong */}
                  <div className={!product.isAvailable ? "opacity-30 pointer-events-none" : ""}>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}