import { PRODUCT_TAG } from "@prisma/client";

export interface CreateProductArgs {
    title: string;
    description?: string;
    tags?: PRODUCT_TAG[]
}