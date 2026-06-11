import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';


@Module({
  imports: [PrismaModule, EmbeddingModule, AuthModule, ProductModule],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule { }
