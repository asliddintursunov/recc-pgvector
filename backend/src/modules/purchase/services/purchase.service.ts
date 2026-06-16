import { Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";

@Injectable()
export class PurchaseService {
    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async getHistory() { }

    async getDetails() { }

    async create() { }
}