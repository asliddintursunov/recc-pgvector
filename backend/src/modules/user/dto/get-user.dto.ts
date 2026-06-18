import { IsNotEmpty, IsString } from "class-validator";

export class GetUserParamDto {
    @IsString()
    @IsNotEmpty()
    id!: string
}
