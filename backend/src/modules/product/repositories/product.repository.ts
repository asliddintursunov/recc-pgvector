import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateProductArgs, UpdateProductArgs } from "../interfaces";
import { Product } from "@prisma/client";

@Injectable()
export class ProductRepository {
    constructor(private readonly prismService: PrismaService) { }

    async create(data: CreateProductArgs, embedding: number[]): Promise<Product | null> {
        const vector = `[${embedding.join(',')}]`;

        return this.prismService.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    creatorId: data.userId,
                    ...data,
                }
            });

            await tx.$executeRaw`
                UPDATE "Product"
                SET "embedding" = ${vector}::vector
                WHERE "id" = ${product.id}
            `;

            return product ?? null;
        });
    }

    async updateWithEmbedding(id: string, data: UpdateProductArgs, embedding: number[]): Promise<Product | null> {
        const vector = `[${embedding.join(',')}]`;

        return this.prismService.$transaction(async (tx) => {
            const product = await tx.product.update({
                data,
                where: { id },
            });

            await tx.$executeRaw`
                UPDATE "Product"
                SET "embedding" = ${vector}::vector
                WHERE "id" = ${product.id}
            `;

            return product ?? null;
        });
    }

    async getById(id: string): Promise<Product | null> {
        const product = await this.prismService.product.findFirst({
            where: {
                id,
                isDeleted: false,
            }
        })

        return product ?? null
    }

    async getAll(): Promise<Product[]> {
        const products = await this.prismService.product.findMany({
            where: {
                isDeleted: false,
            }
        })
        return products
    }

    async getRecommended(userId: string): Promise<Product[]> {
        return await this.prismService.$queryRaw<Product[]>`
            WITH interacted_products AS (
                SELECT
                    p."embedding",
                    CASE i."actionType"
                        WHEN 'like' THEN 3.0
                        WHEN 'click' THEN 2.0
                        WHEN 'search' THEN 1.0
                    END AS weight
                FROM "Interaction" i
                JOIN "Product" p ON p."id" = i."productId"
                WHERE i."userId" = ${userId}
                AND p."embedding" IS NOT NULL
                AND p."isDeleted" = false
            )
            SELECT
                p."id",
                p."title",
                p."description",
                p."createdAt",
                p."tags",
                p."price"
            FROM "Product" p
            WHERE p."embedding" IS NOT NULL
            AND p."isDeleted" = false
            AND NOT EXISTS (
                SELECT 1
                FROM "Interaction" i
                WHERE i."userId" = ${userId}
                AND i."productId" = p."id"
            )
            ORDER BY COALESCE(
                (
                    SELECT MIN((p."embedding" <=> ip."embedding") / ip.weight)
                    FROM interacted_products ip
                ),
                0
            ) ASC,
            p."createdAt" DESC
            LIMIT 10
        `
    }

    async update(id: string, data: UpdateProductArgs): Promise<Product | null> {
        const product = await this.prismService.product.update({
            data,
            where: { id }
        })
        return product ?? null
    }
}
