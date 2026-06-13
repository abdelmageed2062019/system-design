'use client';

import { useMemo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Product } from '@/core/types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

export default function ProductsPage() {
  // Generate 100,000 products in memory.
  const mockProducts = useMemo(() => {
    return Array.from({ length: 100000 }).map((_, index) => ({
      id: `prod-${index + 1}`,
      title: `Advanced Commerce Product ${index + 1}`,
      price: 100 + (index % 900),
      category: index % 2 === 0 ? 'Logistics' : 'E-commerce',
      description: 'A production-ready product profile built for large retailers and delivery network operations.',
      thumbnail: '',
    })) as Product[];
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 relative">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Digital Product Warehouse</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-performance rendering for 100,000 products</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <VirtuosoGrid
          useWindowScroll
          data={mockProducts}
          listClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          itemContent={(index, product) => (
            <div className="h-[380px]">
              <ProductCard product={product} />
            </div>
          )}
        />
      </main>

      {/* Floating cart for real-time updates */}
      <CartDrawer />
    </div>
  );
}
