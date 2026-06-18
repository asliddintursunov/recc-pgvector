import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PurchaseService } from "../services/purchase.service";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type User } from "@prisma/client";
import { CreatePurchaseDto } from "../dtos";
import { CreatePurchaseResponse, GetPurchaseHistoryResponse } from "../interfaces";
import { Roles, RolesGuard } from "src/shared/guards";

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Get('history')
    @Roles('admin', 'customer')
    @UseGuards(RolesGuard)
    async getAll(@CurrentUser() user: User): Promise<GetPurchaseHistoryResponse[]> {
        return this.purchaseService.getAll({
            userId: user.id,
            userRole: user.role,
        });
    }

    @Get(':id')
    @Roles('admin', 'customer')
    @UseGuards(RolesGuard)
    async getDetails(
        @CurrentUser() user: User,
        @Param('id') purchaseId: string
    ): Promise<GetPurchaseHistoryResponse | null> {
        return this.purchaseService.getDetails({
            id: purchaseId,
            userId: user.id,
            userRole: user.role,
        });
    }

    @Post()
    @Roles('customer')
    @UseGuards(RolesGuard)
    async create(
        @CurrentUser() user: User,
        @Body() data: CreatePurchaseDto[]
    ): Promise<CreatePurchaseResponse> {

        await this.purchaseService.create({
            userId: user.id,
            userRole: user.role,
            products: data
        });

        return { message: "Products have been purchased successfully!" }
    }
}
