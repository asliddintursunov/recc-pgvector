import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PurchaseService } from "../services/purchase.service";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type User } from "@prisma/client";
import { CreatePurchaseDto } from "../dtos";
import { CreatePurchaseResponse, GetPurchaseHistoryResponse } from "../interfaces";

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Get('history')
    async getAll(@CurrentUser() user: User): Promise<GetPurchaseHistoryResponse[]> {
        return this.purchaseService.getAll(user.id);
    }

    @Get(':id')
    async getDetails(@Param('id') purchaseId: string): Promise<GetPurchaseHistoryResponse | null> {
        return this.purchaseService.getDetails(purchaseId);
    }

    @Post()
    async create(
        @CurrentUser() user: User,
        @Body() data: CreatePurchaseDto[]
    ): Promise<CreatePurchaseResponse> {

        await this.purchaseService.create({
            userId: user.id,
            products: data
        });

        return { message: "Products have been purchased successfully!" }
    }
}