'use client';

import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/features/checkout/schemas/checkoutSchema';

export function ShippingStep() {
     const {
          register,
          formState: { errors },
     } = useFormContext<CheckoutFormData>();

     return (
          <div className="space-y-4 animate-fade-in">
               <h3 className="text-base font-bold text-slate-800 border-b pb-2">1. بيانات الشحن والتوصيل</h3>

               <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">الاسم الكامل</label>
                    <input
                         {...register('shipping.fullName')}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                         placeholder="جون دو"
                    />
                    {errors.shipping?.fullName && (
                         <p className="text-rose-500 text-xs mt-1 font-medium">{String(errors.shipping.fullName.message)}</p>
                    )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label className="block text-xs font-semibold text-slate-600 mb-1">رقم الهاتف</label>
                         <input
                              {...register('shipping.phone')}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors text-left"
                              placeholder="01012345678"
                         />
                         {errors.shipping?.phone && (
                              <p className="text-rose-500 text-xs mt-1 font-medium">{String(errors.shipping.phone.message)}</p>
                         )}
                    </div>
                    <div>
                         <label className="block text-xs font-semibold text-slate-600 mb-1">المدينة</label>
                         <input
                              {...register('shipping.city')}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                              placeholder="القاهرة"
                         />
                         {errors.shipping?.city && (
                              <p className="text-rose-500 text-xs mt-1 font-medium">{String(errors.shipping.city.message)}</p>
                         )}
                    </div>
               </div>

               <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">العنوان بالتفصيل</label>
                    <textarea
                         {...register('shipping.address')}
                         rows={3}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                         placeholder="رقم الشقة، الدور، اسم الشارع، المعلم المميز..."
                    />
                    {errors.shipping?.address && (
                         <p className="text-rose-500 text-xs mt-1 font-medium">{String(errors.shipping.address.message)}</p>
                    )}
               </div>
          </div>
     );
}
