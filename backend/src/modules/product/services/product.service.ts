import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { CreateProductArgs, GetProductByIdInterfaceArgs, GetProductInterfaceArgs, UpdateProductArgs } from "../interfaces";
import { Product, PRODUCT_TAG, USER_ROLE } from "@prisma/client";
import { EmbeddingService } from "src/modules/embedding/services/embedding.service";

type ProductEmbeddingSource = {
    title: string;
    description?: string | null;
    tags?: PRODUCT_TAG[];
}

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
        const product = await this.productRepository.create({
            ...args,
            embedding,
        })

        if (!product) {
            throw new BadRequestException('Error creating a product!')
        }

        return product
    }

    async update(args: UpdateProductArgs): Promise<Product> {
        const product = await this.productRepository.getByIdForUpdate(args.id)

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        if (args.userRole !== USER_ROLE.admin && product.creator.userId !== args.userId) {
            throw new ForbiddenException('Only product creator or admin can update the product!')
        }

        const embeddingSource = {
            title: args.title ?? product.title,
            description: args.description ?? product.description,
            tags: args.tags ?? product.tags,
        }

        const embedding = await this.embeddingService.generateProductEmbedding(
            this.buildEmbeddingText(embeddingSource),
        )

        const updatedProduct = await this.productRepository.update({
            ...args,
            embedding,
        })

        if (!updatedProduct) {
            throw new Error("Error updating the product")
        }

        return updatedProduct
    }

    async getAll(args: GetProductInterfaceArgs): Promise<Product[]> {
        const products = await this.productRepository.getAll(args)

        return products
    }

    async getById(args: GetProductByIdInterfaceArgs): Promise<Product> {
        const product = await this.productRepository.getById(args)

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        return product
    }

    async getRecommended(args: GetProductInterfaceArgs): Promise<Product[]> {
        return await this.productRepository.getRecommended(args)
    }

    private buildEmbeddingText(args: ProductEmbeddingSource): string {
        const parts = [
            args.title,
            args.description,
            args.tags?.join(', '),
        ].filter(Boolean);

        return parts.join('\n');
    }

}
