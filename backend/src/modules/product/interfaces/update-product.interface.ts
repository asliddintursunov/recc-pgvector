import { PRODUCT_TAG, USER_ROLE } from "@prisma/client";

export interface UpdateProductArgs {
    userId: string;
    userRole: USER_ROLE,
    id: string;
    title?: string;
    description?: string;
    tags?: PRODUCT_TAG[]
}