import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { FacilityModule } from './facility/facility.module';
import { PermissionModule } from './permission/permission.module';
import { BuildingInfoModule } from './building-info/building-info.module';
import { FileUploadController } from './files-upload/files-upload.controller';
import { join } from 'path';

console.log(join(__dirname, '..', 'files'));
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files',
    }),
    UsersModule,
    FacilityModule,
    PermissionModule,
    BuildingInfoModule,
  ],
  controllers: [AppController, AuthController, FileUploadController],
  providers: [AppService, PrismaService, UsersService],
})
export class AppModule {}
