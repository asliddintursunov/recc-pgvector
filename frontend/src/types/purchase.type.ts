import type { ProductTag } from "./tags.type";

export interface PurchaseProduct {
    title: string;
    description: string | null;
    tags: ProductTag[];
    price: number;
}

export interface Purchase {
    id: string;
    createdAt: string;
    quantity: number;
    product: PurchaseProduct;
}

export interface CreatePurchaseBody {
    productId: string;
    quantity: number;
}

export interface CreatePurchaseResponse {
    message: string;
}
