import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.respository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }
}