import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreatePurchaseNormalizedArgs, GetPurchaseArgs, GetPurchaseDetailsArgs } from "../interfaces";
import { USER_ROLE } from "@prisma/client";

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
        const history = await this.prismaService.purchaseHistory.createMany({
            data
        })
        return history;
    }
}
