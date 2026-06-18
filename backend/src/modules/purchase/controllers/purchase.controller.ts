import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PurchaseService } from "../services/purchase.service";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type User } from "@prisma/client";
import { CreatePurchaseDto, GetPurchaseParamDto } from "../dtos";
import { CreatePurchaseResponse, GetPurchasesResponse } from "../interfaces";
import { Roles, RolesGuard } from "src/shared/guards";

@Controller('purchases')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Get()
    @Roles('admin', 'customer')
    @UseGuards(RolesGuard)
    async get(@CurrentUser() user: User): Promise<GetPurchasesResponse[]> {
        return this.purchaseService.get({
            userId: user.id,
            userRole: user.role,
        });
    }

    @Get(':id')
    @Roles('admin', 'customer')
    @UseGuards(RolesGuard)
    async getDetails(
        @CurrentUser() user: User,
        @Param('id') id: GetPurchaseParamDto['id']
    ): Promise<GetPurchasesResponse | null> {
        return this.purchaseService.getDetails({
            id: id,
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
