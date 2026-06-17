import { PRODUCT_TAG } from "@prisma/client";

export interface GetPurchaseProductResponse {
    title: string;
    description: string | null;
    tags: PRODUCT_TAG[];
    price: number;
}

export interface GetPurchaseHistoryResponse {
    id: string;
    purchaseDate: Date;
    quantity: number;
    product: GetPurchaseProductResponse;
}
