import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateProductArgs, CreateProductWithEmbeddingArgs, GetProductByIdInterfaceArgs, GetProductInterfaceArgs, UpdateProductWithEmbeddingArgs } from "../interfaces";
import { Product, USER_ROLE } from "@prisma/client";

type ProductWithCreator = Product & {
    creator: {
        userId: string;
    };
};

@Injectable()
export class ProductRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(args: CreateProductWithEmbeddingArgs): Promise<Product | null> {
        const { embedding, ...data } = args;
        const vector = `[${embedding.join(',')}]`;
        const { userId, userRole: _userRole, ...productData } = data;

        return this.prismaService.$transaction(async (tx) => {
            const merchant = await tx.merchant.upsert({
                where: { userId },
                update: {},
                create: { userId },
            });

            const product = await tx.product.create({
                data: {
                    ...productData,
                    creatorId: merchant.id,
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

    async getById(args: GetProductByIdInterfaceArgs): Promise<Product | null> {
        const { userId, userRole, id } = args
        return await this.prismaService.product.findFirst({
            where: {
                id,
                isDeleted: false,
                ...(userRole === 'merchant' && { creator: { userId: { not: userId } } })
            }
        }) ?? null;
    }

    async getByIdForUpdate(id: string): Promise<ProductWithCreator | null> {
        return await this.prismaService.product.findFirst({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                creator: {
                    select: {
                        userId: true,
                    }
                }
            }
        }) ?? null;
    }


    async getAll(args: GetProductInterfaceArgs): Promise<Product[]> {
        const { userId, userRole } = args
        return await this.prismaService.product.findMany({
            where: {
                isDeleted: false,
                ...(userRole === 'merchant' && { creator: { userId: { not: userId } } })
            }
        });
    }


    async getRecommended(args: GetProductInterfaceArgs): Promise<Product[]> {
        const { userId, userRole } = args;
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
        JOIN "Merchant" m ON m."id" = p."creatorId"
        WHERE p."embedding" IS NOT NULL
        AND p."isDeleted" = false
        AND (${isMerchant} = false OR m."userId" != ${userId})
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
