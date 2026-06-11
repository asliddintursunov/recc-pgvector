import { UserRepository } from 'src/modules/user/repositories/user.respository';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './../services/auth.service';
import { IS_PUBLIC_KEY } from 'src/shared/decorators';
import { safeErrorMessage } from 'src/shared/utils';
import { AuthRequest } from 'src/shared/types';


@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthRequest>();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException(safeErrorMessage('authorization header is missing', 'unauthorized'));
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException(safeErrorMessage('authorization header must use bearer token', 'unauthorized'));
        }

        const payload = await this.authService.verifyAccessToken(token);
        const user = await this.userRepository.getById(payload.sub);

        if (!user) {
            throw new UnauthorizedException(safeErrorMessage('user associated with this token was not found', 'unauthorized'));
        }

        request.user = user;

        return true;
    }
}
