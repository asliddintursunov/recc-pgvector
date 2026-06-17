export interface CreatePurchaseArgs {
    userId: string;
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

export interface CreatePurchaseResponse {
    message: string;
}