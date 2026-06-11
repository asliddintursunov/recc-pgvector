import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { Product } from "@prisma/client";
import { CreateProductDto } from "../dtos";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    async create(@Body() body: CreateProductDto): Promise<Product> {
        return await this.productService.create(body)
    }
}