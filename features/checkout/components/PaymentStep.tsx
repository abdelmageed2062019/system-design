'use client';

import { useFormContext } from 'react-hook-form';
import { CreditCard, Truck } from 'lucide-react';
import type { CheckoutFormData } from '@/features/checkout/schemas/checkoutSchema';

export function PaymentStep() {
     const {
          register,
          formState: { errors },
     } = useFormContext<CheckoutFormData>();

     return (
          <div className="space-y-4 animate-fade-in">
               <h3 className="text-base font-bold text-slate-800 border-b pb-2">2. طريقة الدفع</h3>

               <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                         <div className="flex items-center gap-3">
                              <input type="radio" value="CARD" {...register('payment.paymentMethod')} className="w-4 h-4 text-blue-600" />
                              <div>
                                   <span className="block text-sm font-bold text-slate-800">الدفع بالبطاقة الائتمانية</span>
                                   <span className="block text-xs text-slate-400">Visa, Mastercard, Meeza</span>
                              </div>
                         </div>
                         <CreditCard className="text-slate-400" size={20} />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                         <div className="flex items-center gap-3">
                              <input type="radio" value="COD" {...register('payment.paymentMethod')} className="w-4 h-4 text-blue-600" />
                              <div>
                                   <span className="block text-sm font-bold text-slate-800">الدفع عند الاستلام (COD)</span>
                                   <span className="block text-xs text-slate-400">الدفع كاش للمندوب فور وصول الشحنة</span>
                              </div>
                         </div>
                         <Truck className="text-slate-400" size={20} />
                    </label>
               </div>

               {errors.payment?.paymentMethod && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">{String(errors.payment.paymentMethod.message)}</p>
               )}
          </div>
     );
}
