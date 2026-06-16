import { PRODUCT_TAG } from "@prisma/client";

export class GetPurchaseProductResponseDto {
    title!: string;
    description!: string | null;
    tags!: PRODUCT_TAG[];
    price!: number;
}

export class GetPurchaseHistoryResponseDto {
    id!: string;
    purchaseDate!: Date;
    quantity!: number;
    product!: GetPurchaseProductResponseDto;
}
