import { Controller, Get, Post } from "@nestjs/common";
import { PurchaseService } from "../services/purchase.service";

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Get('history')
    async getHistory() { }

    @Get(':id')
    async getDetails() { }

    @Post()
    async create() { }
}