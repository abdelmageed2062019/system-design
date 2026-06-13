// features/cart/store/useLogiMartStore.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/core/types';

interface LogiMartState {
     cartItems: CartItem[];
     addToCart: (product: Product) => void;
     removeFromCart: (productId: string) => void;
     clearCart: () => void;
}

export const useLogiMartStore = create<LogiMartState>()(
     persist(
          (set, get) => ({
               cartItems: [],

               addToCart: (product) => {
                    const currentItems = get().cartItems;
                    const existingItem = currentItems.find((item) => item.productId === product.id);

                    if (existingItem) {
                         set({
                              cartItems: currentItems.map((item) =>
                                   item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                              ),
                         });
                    } else {
                         set({ cartItems: [...currentItems, { productId: product.id, product, quantity: 1 }] });
                    }
               },

               removeFromCart: (productId) => {
                    const currentItems = get().cartItems;
                    set({
                         cartItems: currentItems.filter((item) => item.productId !== productId),
                    });
               },

               clearCart: () => set({ cartItems: [] }),
          }),
          {
               name: 'logimart-cart-storage',
               storage: createJSONStorage(() => localStorage),
          }
     )
);