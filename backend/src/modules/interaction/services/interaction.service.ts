import { Injectable } from "@nestjs/common";
import { InteractionRepository } from "../repositories/interaction.repository";

@Injectable()
export class InteractionService {
    constructor(
        private readonly interactionRepository: InteractionRepository,
    ) { }
}