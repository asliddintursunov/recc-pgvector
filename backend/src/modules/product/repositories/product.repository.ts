import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateProductArgs, UpdateProductArgs } from "../interfaces";
import { Product } from "@prisma/client";

@Injectable()
export class ProductRepository {
    constructor(private readonly prismService: PrismaService) { }

    async create(data: CreateProductArgs): Promise<Product | null> {
        const product = await this.prismService.product.create({ data })
        return product ?? null
    }

    async getById(id: string): Promise<Product | null> {
        const product = await this.prismService.product.findFirst({
            where: {
                id
            }
        })

        return product ?? null
    }

    async update(id: string, data: UpdateProductArgs): Promise<Product | null> {
        const product = await this.prismService.product.update({
            data,
            where: { id }
        })
        return product ?? null
    }
}