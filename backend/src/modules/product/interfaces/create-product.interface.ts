import { PRODUCT_TAG, USER_ROLE } from "@prisma/client";

export interface CreateProductArgs {
    title: string;
    description?: string;
    userId: string;
    userRole: USER_ROLE;
    tags?: PRODUCT_TAG[]
}

export interface CreateProductWithEmbeddingArgs extends CreateProductArgs {
    embedding: number[];
}