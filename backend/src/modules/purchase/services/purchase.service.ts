import { ForbiddenException, Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { CreatePurchaseArgs, CreatePurchaseNormalizedArgs, GetPurchaseArgs, GetPurchaseDetailsArgs } from "../interfaces";
import { USER_ROLE } from "@prisma/client";

@Injectable()
export class PurchaseService {
    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async getAll(args: GetPurchaseArgs) {
        return this.purchaseRepository.getAll(args);
    }

    async getDetails(args: GetPurchaseDetailsArgs) {
        return this.purchaseRepository.getDetails(args);
    }

    async create(args: CreatePurchaseArgs) {
        const { userId, userRole, products } = args;

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
