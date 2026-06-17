import { PRODUCT_TAG } from "@prisma/client";

export interface UpdateProductArgs {
    userId: string;
    id: string;
    title?: string;
    description?: string;
    tags?: PRODUCT_TAG[]
}