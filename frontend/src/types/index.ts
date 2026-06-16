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

export const PRODUCT_TAG_OPTIONS = [
  "new",
  "used",
  "gaming",
  "electronics",
  "audio",
  "wireless",
  "laptop",
  "smartphone",
  "home_appliance",
  "furniture",
  "fitness",
  "books",
] as const satisfies readonly ProductTag[];

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
