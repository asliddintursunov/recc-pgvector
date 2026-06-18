import { IsNotEmpty, IsString } from "class-validator";

export class GetPurchaseParamDto {
    @IsString()
    @IsNotEmpty()
    id!: string
}
