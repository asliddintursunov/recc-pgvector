import type { ProductTag } from "./tags.type";

export interface Product {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    tags: ProductTag[];
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