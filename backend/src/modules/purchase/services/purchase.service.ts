import { Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { CreatePurchaseArgs } from "../interfaces";

@Injectable()
export class PurchaseService {
    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async getAll(userId: string) {
        return this.purchaseRepository.getAll(userId);
    }

    async getDetails(purchaseId: string) {
        return this.purchaseRepository.getDetails(purchaseId);
    }

    async create(args: { userId: string; data: Omit<CreatePurchaseArgs, "userId">[] }) {
        const createData: CreatePurchaseArgs[] = args.data.map((e) => {
            return {
                userId: args.userId,
                productId: e.productId,
                quantity: e.quantity
            }
        })
        const result = await this.purchaseRepository.create(createData)
        return result;
    }
}