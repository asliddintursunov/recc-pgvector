import { Module } from "@nestjs/common";
import { PurchaseController } from "./controllers/purchase.controller";
import { PurchaseRepository } from "./repositories/purchase.repository";
import { PurchaseService } from "./services/purchase.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    exports: [],
    imports: [PrismaModule],
    controllers: [PurchaseController],
    providers: [PurchaseService, PurchaseRepository],
})
export class PurchaseModule { }