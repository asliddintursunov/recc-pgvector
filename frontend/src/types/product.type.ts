import type { ProductTag } from "./tags.type";

export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    tags: ProductTag[];
    isDeleted: boolean;
    merchantId: string;
}

export interface CreateProductBody {
    title: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    tags?: ProductTag[];
}

export interface UpdateProductBody {
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    tags?: ProductTag[];
}
