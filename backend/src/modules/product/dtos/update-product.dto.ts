import { PRODUCT_TAG } from '@prisma/client';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsArray()
    @IsEnum(PRODUCT_TAG, {
        each: true,
        message: `tags must contain only: ${Object.values(PRODUCT_TAG).join(', ')}`,
    })
    @IsOptional()
    tags?: PRODUCT_TAG[];
}

export class UpdateProductParamDto {
    @IsString()
    @IsNotEmpty()
    id!: string
}
