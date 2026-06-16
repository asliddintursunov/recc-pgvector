import { IsNumber, IsString } from "class-validator";

export class CreatePurchaseDto {
    @IsString()
    productId!: string;

    @IsNumber()
    quantity!: number;
}