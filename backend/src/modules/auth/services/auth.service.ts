import { ConflictException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '@prisma/client';

import { Hasher, InvalidTokenError, Jwt } from 'src/shared/libs';
import { type JWTPayload } from 'jose';
import { ENV } from 'src/shared/configs';
import { AuthInterfaceArgs } from '../interfaces';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository) { }

    async register(args: AuthInterfaceArgs): Promise<User> {
        const { username, password } = args;
        const user = await this.authRepository.getByUsername(username)

        if (user) throw new ConflictException("User with this username already exists!")

        const hashedPassword = await Hasher.hash(password);

        const newUser = await this.authRepository.create({
            username,
            password: hashedPassword
        })

        if (!newUser) throw new Error("Error creating a user, please try again!")

        return newUser
    }

    async login(args: AuthInterfaceArgs): Promise<{ accessToken: string }> {
        const { username, password } = args;
        const user = await this.authRepository.getByUsername(username)

        if (!user) throw new NotFoundException("Username or password is wrong, please try again!")


        const isEqual = await Hasher.verify(user.password, password);

        if (!isEqual) throw new UnprocessableEntityException('Username or password is wrong, please try again!');

        const accessToken = await this.createAccessToken(user.id);

        return { accessToken };

    }


    async createAccessToken(userId: string): Promise<string> {
        const payload: AccessTokenPayload = {
            sub: userId,
        };
        const options = {
            secret: ENV.AUTH_JWT_ACCESS_SECRET,
            expiresIn: ENV.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN
        };

        return Jwt.sign(payload, options);
    }

    async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
        try {
            const options = {
                secret: ENV.AUTH_JWT_ACCESS_SECRET,
                clockTolerance: 5,
            };

            const result = await Jwt.verify<AccessTokenPayload>(token, options);
            return result;
        } catch (error) {
            if (error instanceof InvalidTokenError) {
                throw new UnauthorizedException('invalid or expired access token');
            }

            throw error;
        }
    }

}

type AccessTokenPayload = JWTPayload & {
    sub: string;
};