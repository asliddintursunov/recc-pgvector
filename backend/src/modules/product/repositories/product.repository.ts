import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateProductArgs, UpdateProductArgs } from "../interfaces";
import { Product, USER_ROLE } from "@prisma/client";

@Injectable()
export class ProductRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateProductArgs, embedding: number[]): Promise<Product | null> {
        const vector = `[${embedding.join(',')}]`;

        return this.prismaService.$transaction(async (tx) => {
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

    async update(id: string, data: UpdateProductArgs, embedding: number[]): Promise<Product | null> {
        const vector = `[${embedding.join(',')}]`;

        return this.prismaService.$transaction(async (tx) => {
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

    async getById(userId: string, userRole: USER_ROLE, id: string): Promise<Product | null> {
        return await this.prismaService.product.findFirst({
            where: {
                id,
                isDeleted: false,
                ...(userRole === 'merchant' && { creatorId: { not: userId } })
            }
        }) ?? null;
    }


    async getAll(userId: string, userRole: USER_ROLE): Promise<Product[]> {
        return await this.prismaService.product.findMany({
            where: {
                isDeleted: false,
                ...(userRole === 'merchant' && { creatorId: { not: userId } })
            }
        });
    }


    async getRecommended(userId: string, userRole: USER_ROLE): Promise<Product[]> {
        const isMerchant = userRole === 'merchant';

        return await this.prismaService.$queryRaw<Product[]>`
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
        AND (${isMerchant} = false OR p."creatorId" != ${userId})
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
    `;
    }

}
