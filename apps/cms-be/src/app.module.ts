import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { FacilityModule } from './facility/facility.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [UsersModule, FacilityModule, PermissionModule],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, UsersService],
})
export class AppModule {}
