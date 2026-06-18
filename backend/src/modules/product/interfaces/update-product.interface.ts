import { PRODUCT_TAG, USER_ROLE } from "@prisma/client";

export interface UpdateProductArgs {
    id: string;
    userId: string;
    userRole: USER_ROLE,
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    tags?: PRODUCT_TAG[]
}

export interface UpdateProductWithEmbeddingArgs extends UpdateProductArgs {
    embedding: number[];
}
