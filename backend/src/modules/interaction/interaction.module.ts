import { Module } from "@nestjs/common";
import { InteractionController } from "./controllers/interaction.controller";
import { InteractionService } from "./services/interaction.service";
import { InteractionRepository } from "./repositories/interaction.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    exports: [],
    imports: [PrismaModule],
    controllers: [InteractionController],
    providers: [InteractionService, InteractionRepository],
})
export class InteractionModule { }