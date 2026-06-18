import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.respository";
import { USER_ROLE } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async getProfile(userId: string) {
        return this.userRepository.getProfile(userId);
    }

    async getCustomers() {
        return this.userRepository.getByRole(USER_ROLE.customer);
    }

    async getMerchants() {
        return this.userRepository.getByRole(USER_ROLE.merchant);
    }
}
