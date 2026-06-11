import { Module } from "@nestjs/common";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { ProductRepository } from "./repositories/product.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { InteractionService } from "./services/interaction.service";
import { InteractionRepository } from "./repositories/interaction.repository";

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository, InteractionService, InteractionRepository]
})
export class ProductModule { }