export type ProductTag =
  | "new"
  | "used"
  | "gaming"
  | "electronics"
  | "audio"
  | "wireless"
  | "laptop"
  | "smartphone"
  | "home_appliance"
  | "furniture"
  | "fitness"
  | "books";

export type InteractionType = "search" | "click" | "like";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  tags: ProductTag[];
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface CreateProductBody {
  title: string;
  description?: string;
  tags?: ProductTag[];
}

export interface UpdateProductBody {
  title?: string;
  description?: string;
  tags?: ProductTag[];
}

export interface ApiError {
  message: string;
  data: {
    message: string;
  }
  status?: number;
  details?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export type LocalOrderStatus = "processing" | "confirmed" | "packed" | "delivered";

export interface CheckoutDetails {
  fullName: string;
  email: string;
  address: string;
}

export interface LocalOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: LocalOrderStatus;
  customer: CheckoutDetails;
  createdAt: string;
}
