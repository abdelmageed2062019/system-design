'use client';

import { useLogiMartStore } from '@/features/cart/store/useLogiMartStore';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export function CartDrawer() {
     const [isOpen, setIsOpen] = useState(false);
     const cartItems = useLogiMartStore((state) => state.cartItems);
     const removeFromCart = useLogiMartStore((state) => state.removeFromCart);
     const clearCart = useLogiMartStore((state) => state.clearCart);

     const totalCost = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

     return (
          <>
               <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-2 font-bold"
               >
                    <ShoppingBag size={24} />
                    <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                         {cartItems.length}
                    </span>
               </button>

               {isOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
                         <div className="w-full max-w-md bg-white h-screen shadow-2xl p-6 flex flex-col justify-between">
                              <div>
                                   <div className="flex justify-between items-center pb-4 border-b">
                                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                             <ShoppingBag className="text-blue-600" /> Shopping Cart
                                        </h2>
                                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
                                             ✕
                                        </button>
                                   </div>

                                   {/* Added items list */}
                                   <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                                        {cartItems.length === 0 ? (
                                             <p className="text-center text-sm text-slate-400 py-12">Your cart is currently empty.</p>
                                        ) : (
                                             cartItems.map((item) => (
                                                  <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                       <div>
                                                            <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.product.title}</h4>
                                                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                                 ${item.product.price} × {item.quantity}
                                                            </p>
                                                       </div>
                                                       <button
                                                            onClick={() => removeFromCart(item.productId)}
                                                            className="text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                                                       >
                                                            <Trash2 size={16} />
                                                       </button>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>

                              {/* Totals and actions */}
                              {cartItems.length > 0 && (
                                   <div className="border-t pt-4 space-y-4">
                                        <div className="flex justify-between items-center text-slate-900 font-bold">
                                             <span>Total:</span>
                                             <span className="font-mono text-xl">${totalCost}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                             <button
                                                  onClick={clearCart}
                                                  className="py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-semibold"
                                             >
                                                  Clear Cart
                                             </button>
                                             <a
                                                  href="/checkout"
                                                  className="py-2.5 bg-blue-600 text-white text-center rounded-xl hover:bg-blue-700 text-xs font-semibold flex items-center justify-center"
                                             >
                                                  Go to Checkout
                                             </a>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>
               )}
          </>
     );
}
