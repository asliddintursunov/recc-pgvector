import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { Product, type User } from "@prisma/client";
import { CreateProductDto, UpdateProductDto, UpdateProductParamDto } from "../dtos";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { CreateInteractionBodyDto, CreateInteractionParamsDto } from "../dtos/create-inetraction.dto";
import { InteractionService } from "../services/interaction.service";

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly interactionService: InteractionService,
    ) { }

    @Get()
    async getAll(): Promise<Product[]> {
        return await this.productService.getAll();
    }

    @Get("recommended")
    async getRecommended(@CurrentUser() user: User): Promise<Product[]> {
        return await this.productService.getRecommended(user.id)
    }

    @Get(":id")
    async getById(@Param() params: UpdateProductParamDto): Promise<Product> {
        const { id } = params
        return await this.productService.getById(id)
    }

    @Post()
    async create(@Body() body: CreateProductDto): Promise<Product> {
        return await this.productService.create(body)
    }

    @Patch(":id")
    async update(@Param() params: UpdateProductParamDto, @Body() body: UpdateProductDto): Promise<Product> {
        const { id } = params
        return await this.productService.update(id, body)
    }

    @Post(":id/interaction")
    async createInteraction(
        @CurrentUser() user: User,
        @Param() params: CreateInteractionParamsDto,
        @Body() body: CreateInteractionBodyDto
    ): Promise<boolean> {
        return this.interactionService.create({
            userId: user.id,
            productId: params.id,
            actionType: body.actionType,
        })
    }
}
