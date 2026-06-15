import { Injectable } from "@nestjs/common";
import { InteractionRepository } from "../repositories/interaction.repository";
import { CreateInteractionArgs } from "../interfaces/create-interaction.interface";

@Injectable()
export class InteractionService {
    constructor(
        private readonly interactionRepository: InteractionRepository,
    ) { }

    async create(args: CreateInteractionArgs): Promise<boolean> {
        const interaction = await this.interactionRepository.create(args)
        if (!interaction) {
            return false
        }
        return true
    }
}