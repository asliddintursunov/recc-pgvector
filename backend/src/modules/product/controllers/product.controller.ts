import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { Product } from "@prisma/client";
import { CreateProductDto, UpdateProductDto, UpdateProductParamDto } from "../dtos";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    async create(@Body() body: CreateProductDto): Promise<Product> {
        return await this.productService.create(body)
    }

    @Patch(":id")
    async update(@Param() params: UpdateProductParamDto, @Body() body: UpdateProductDto): Promise<Product> {
        const { id } = params
        return await this.productService.update(id, body)
    }
}