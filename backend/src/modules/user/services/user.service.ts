import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.respository";
import { CreateMerchantArgs } from "../interfaces";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async switchToMerchant(args: CreateMerchantArgs) {
        return this.userRepository.switchToMerchant(args);
    }

    async switchToCustomer(userId: string) {
        return this.userRepository.switchToCustomer(userId);
    }
}
