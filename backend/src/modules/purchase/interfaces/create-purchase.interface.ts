import { USER_ROLE } from "@prisma/client";

export interface CreatePurchaseResponse {
    message: string;
}

export interface CreatePurchaseArgs {
    userId: string;
    userRole: USER_ROLE;
    products: {
        productId: string;
        quantity: number;
    }[]
}

export interface CreatePurchaseNormalizedArgs {
    userId: string;
    productId: string;
    quantity: number;
}