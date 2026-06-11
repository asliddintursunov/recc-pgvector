import { Controller, Get } from "@nestjs/common";
import { InteractionService } from "../services/interaction.service";

@Controller('interactions')
export class InteractionController {
    constructor(
        private readonly interactionService: InteractionService,
    ) { }
}