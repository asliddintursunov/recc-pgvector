import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { CreateProductArgs } from "../interfaces";
import { Product } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository
    ) { }

    async create(args: CreateProductArgs): Promise<Product> {
        const product = await this.productRepository.create(args)

        if (!product) {
            throw new Error('Error creating a product!')
        }

        return product
    }
}