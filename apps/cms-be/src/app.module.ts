import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UsersService],
})
export class AppModule {}
