import { Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { CreatePurchaseArgs, CreatePurchaseNormalizedArgs } from "../interfaces";

@Injectable()
export class PurchaseService {
    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async getAll(userId: string) {
        return this.purchaseRepository.getAll(userId);
    }

    async getDetails(purchaseId: string) {
        return this.purchaseRepository.getDetails(purchaseId);
    }

    async create(args: CreatePurchaseArgs) {
        const { userId, products } = args;

        const data: CreatePurchaseNormalizedArgs[] = products.map(product => ({
            userId,
            productId: product.productId,
            quantity: product.quantity,
        }))

        return await this.purchaseRepository.create(data)
    }
}