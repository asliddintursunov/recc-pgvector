import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guards/access-token.guard';


@Module({
  imports: [PrismaModule, EmbeddingModule, AuthModule, ProductModule, UserModule],
  exports: [],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule { }
