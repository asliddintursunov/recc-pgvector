import { PRODUCT_TAG } from "@prisma/client";

export interface CreateProductArgs {
    title: string;
    description?: string;
    userId: string;
    tags?: PRODUCT_TAG[]
}