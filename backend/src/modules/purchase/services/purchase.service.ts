import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { CreatePurchaseArgs, CreatePurchaseNormalizedArgs, GetPurchaseArgs, GetPurchaseDetailsArgs } from "../interfaces";
import { USER_ROLE } from "@prisma/client";

@Injectable()
export class PurchaseService {
    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async get(args: GetPurchaseArgs) {
        return this.purchaseRepository.get(args);
    }

    async getDetails(args: GetPurchaseDetailsArgs) {
        return this.purchaseRepository.getDetails(args);
    }

    async create(args: CreatePurchaseArgs) {
        const { userId, userRole, products } = args;

        if (typeof products !== 'object' || !Array.isArray(products) || products.length === 0) {
            throw new BadRequestException('Please select at least one product to purchase!')
        }

        if (userRole !== USER_ROLE.customer) {
            throw new ForbiddenException('Only customers can purchase products!')
        }

        const data: CreatePurchaseNormalizedArgs[] = products.map(product => ({
            userId,
            productId: product.productId,
            quantity: product.quantity,
        }))

        return await this.purchaseRepository.create(data)
    }
}
