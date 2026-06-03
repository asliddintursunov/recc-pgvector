import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [PrismaModule, EmbeddingModule, AuthModule],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule { }
