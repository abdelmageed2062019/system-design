'use client';

import { Product } from '@/core/types';
import { useLogiMartStore } from '@/features/cart/store/useLogiMartStore';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
     product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
     const addToCart = useLogiMartStore((state) => state.addToCart);

     return (
          <div className="bg-white border  border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
               <div>
                    <div className="w-full h-40  bg-slate-50 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-slate-400">
                         {/* A Next.js Image component can be added here later. */}
                         <span className="text-xs">Digital product image</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{product.category}</span>
                    <h3 className="font-bold text-slate-800 mt-2 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
               </div>

               <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className="text-lg font-mono font-bold text-slate-900">${product.price}</span>
                    <button
                         onClick={() => addToCart(product)}
                         className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs font-semibold"
                    >
                         <ShoppingCart size={16} />
                         Add
                    </button>
               </div>
          </div>
     );
}
