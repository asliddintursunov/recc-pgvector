import { PRODUCT_TAG } from "@prisma/client";

export interface UpdateProductArgs {
    title?: string;
    description?: string;
    tags?: PRODUCT_TAG[]
}