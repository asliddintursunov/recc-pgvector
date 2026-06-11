import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from '../types';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    if (!request.user) {
        throw new UnauthorizedException('Unauthorized');
    }

    return request.user;
});
