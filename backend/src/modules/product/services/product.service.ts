import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { CreateProductArgs, UpdateProductArgs } from "../interfaces";
import { Product } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository
    ) { }

    async create(args: CreateProductArgs): Promise<Product> {
        const product = await this.productRepository.create(args)

        if (!product) {
            throw new BadRequestException('Error creating a product!')
        }

        return product
    }

    async update(id: string, args: UpdateProductArgs): Promise<Product> {
        const product = await this.productRepository.getById(id)

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        const updatedProduct = await this.productRepository.update(id, args)

        if (!updatedProduct) {
            throw new Error("Error updating the product")
        }

        return updatedProduct
    }

}