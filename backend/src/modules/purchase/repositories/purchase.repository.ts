import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreatePurchaseArgs, CreatePurchaseNormalizedArgs } from "../interfaces";

@Injectable()
export class PurchaseRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async getAll(userId: string) {
        return await this.prismaService.purchaseHistory.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                purchaseDate: true,
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

    async getDetails(id: string) {
        return await this.prismaService.purchaseHistory.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                purchaseDate: true,
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
