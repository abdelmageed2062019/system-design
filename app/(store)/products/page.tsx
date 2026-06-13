'use client';

import { useMemo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Product } from '@/core/types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

export default function ProductsPage() {
  // توليد الـ 100,000 منتج في الـ Memory
  const mockProducts = useMemo(() => {
    return Array.from({ length: 100000 }).map((_, index) => ({
      id: `prod-${index + 1}`,
      title: `منتج تجاري متطور رقم ${index + 1}`,
      price: 100 + (index % 900),
      category: index % 2 === 0 ? 'Logistics' : 'E-commerce',
      description: 'وصف هندسي دقيق للمنتج يوضح الكفاءة والجودة العالية لتلبية احتياجات أساطيل الشحن والمتاجر الكبرى.',
      thumbnail: '',
    })) as Product[];
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 relative">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">مستودع المنتجات الرقمي</h1>
          <p className="text-xs text-slate-500 mt-0.5">تحمل وعرض لحظي لـ 100,000 منتج مستقر الأداء</p>
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

      {/* إضافة مكون العربة العائم لرؤية التحديثات اللحظية */}
      <CartDrawer />
    </div>
  );
}