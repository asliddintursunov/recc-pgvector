import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { CreateProductArgs, UpdateProductArgs } from "../interfaces";
import { Product } from "@prisma/client";
import { EmbeddingService } from "src/modules/embedding/services/embedding.service";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly embeddingService: EmbeddingService,
    ) { }

    async create(args: CreateProductArgs): Promise<Product> {
        const embedding = await this.embeddingService.generateProductEmbedding(
            this.buildEmbeddingText(args),
        )
        const product = await this.productRepository.createWithEmbedding(args, embedding)

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

    async getAll(): Promise<Product[]> {
        const products = await this.productRepository.getAll()

        return products
    }

    async getById(id: string): Promise<Product> {
        const product = await this.productRepository.getById(id)

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        return product
    }

    private buildEmbeddingText(args: CreateProductArgs): string {
        const parts = [
            args.title,
            args.description,
            args.tags?.join(', '),
        ].filter(Boolean);

        return parts.join('\n');
    }

}
