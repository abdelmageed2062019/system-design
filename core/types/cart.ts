import type { Product } from "@/core/types/product";

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
