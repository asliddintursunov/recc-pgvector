import { PRODUCT_TAG, USER_ROLE } from "@prisma/client";

export interface GetPurchaseArgs {
    userId: string;
    userRole: USER_ROLE;
}

export interface GetPurchaseDetailsArgs extends GetPurchaseArgs {
    id: string;
}

export interface GetPurchaseProductResponse {
    title: string;
    description: string | null;
    tags: PRODUCT_TAG[];
    price: number;
}

export interface GetPurchaseHistoryResponse {
    id: string;
    createdAt: Date;
    quantity: number;
    product: GetPurchaseProductResponse;
}
