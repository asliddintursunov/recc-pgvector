import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateProductArgs, CreateProductWithEmbeddingArgs, GetProductByIdArgs, GetProductArgs, UpdateProductWithEmbeddingArgs } from "../interfaces";
import { Product, USER_ROLE } from "@prisma/client";

@Injectable()
export class ProductRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(args: CreateProductWithEmbeddingArgs): Promise<Product | null> {
        const { embedding, ...data } = args;
        const vector = `[${embedding.join(',')}]`;
        const { userId, userRole: _userRole, ...productData } = data;

        return this.prismaService.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...productData,
                    merchantId: userId,
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

    async update(args: UpdateProductWithEmbeddingArgs): Promise<Product | null> {
        const { embedding, id, ...data } = args;
        const vector = `[${embedding.join(',')}]`;
        const { userId: _userId, userRole: _userRole, ...productData } = data;

        return this.prismaService.$transaction(async (tx) => {
            const product = await tx.product.update({
                data: productData,
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

    async getById(args: GetProductByIdArgs): Promise<Product | null> {
        const { userId, userRole, id } = args
        return await this.prismaService.product.findFirst({
            where: {
                id,
                isDeleted: false,
                ...(userRole === USER_ROLE.merchant && { merchantId: userId })
            }
        }) ?? null;
    }

    async getByIdForUpdate(id: string): Promise<Product | null> {
        return await this.prismaService.product.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        }) ?? null;
    }


    async get(args: GetProductArgs): Promise<Product[]> {
        const { userId, userRole } = args
        return await this.prismaService.product.findMany({
            where: {
                isDeleted: false,
                ...(userRole === USER_ROLE.merchant && { merchantId: userId })
            }
        });
    }


    async getRecommended(args: GetProductArgs): Promise<Product[]> {
        const { userId } = args;

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
            p."price",
            p."imageUrl",
            p."tags",
            p."isDeleted",
            p."createdAt",
            p."updatedAt",
            p."merchantId"
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
    `;
    }

}
