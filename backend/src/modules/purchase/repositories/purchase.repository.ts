import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreatePurchaseNormalizedArgs, GetPurchaseArgs, GetPurchaseDetailsArgs } from "../interfaces";
import { INTERACTION_TYPE, USER_ROLE } from "@prisma/client";

@Injectable()
export class PurchaseRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async get(args: GetPurchaseArgs) {
        const { userId, userRole } = args;

        return await this.prismaService.purchaseHistory.findMany({
            where: {
                ...(userRole === USER_ROLE.customer && { userId })
            },
            select: {
                id: true,
                createdAt: true,
                quantity: true,
                product: {
                    select: {
                        title: true,
                        description: true,
                        tags: true,
                        price: true,
                    }
                }
            },
        })
    }

    async getDetails(args: GetPurchaseDetailsArgs) {
        const { id, userId, userRole } = args;

        return await this.prismaService.purchaseHistory.findFirst({
            where: {
                id,
                ...(userRole === USER_ROLE.customer && { userId })
            },
            select: {
                id: true,
                createdAt: true,
                quantity: true,
                product: {
                    select: {
                        title: true,
                        description: true,
                        tags: true,
                        price: true,
                    }
                }
            },
        })
    }

    async create(data: CreatePurchaseNormalizedArgs[]) {
        return await this.prismaService.$transaction(async (tx) => {
            const history = await tx.purchaseHistory.createMany({
                data
            })

            await tx.interaction.createMany({
                data: data.map((purchase) => ({
                    userId: purchase.userId,
                    productId: purchase.productId,
                    actionType: INTERACTION_TYPE.purchase,
                }))
            })

            return history;
        });
    }
}
