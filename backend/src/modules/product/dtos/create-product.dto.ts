import { PRODUCT_TAG } from '@prisma/client';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsEnum(PRODUCT_TAG, {
        each: true,
        message: `tags must contain only: ${Object.values(PRODUCT_TAG).join(', ')}`,
    })
    @IsOptional()
    tags?: PRODUCT_TAG[];
}