import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { FacilityModule } from './facility/facility.module';
import { PermissionModule } from './permission/permission.module';
import { BuildingInfoModule } from './building-info/building-info.module';
import { FileUploadController } from './files-upload/files-upload.controller';
import { MapModule } from './map/map.module';
import { KioskModule } from './kiosk/kiosk.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception/custom-exception.filter';
import { SectionModule } from './section/section.module';
import { PostModule } from './post/post.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FacilityCategoryModule } from './facility-category/facility-category.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { WSGateway } from './websocket.gateway';
import { MonitoringModule } from './monitoring/monitoring.module';
import { MonitoringService } from './monitoring/monitoring.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files',
    }),
    JwtModule.register({
      secret: 'kintexcms',
      signOptions: { expiresIn: '12h' },
    }),
    UserModule,
    FacilityModule,
    PermissionModule,
    BuildingInfoModule,
    MapModule,
    KioskModule,
    SectionModule,
    PostModule,
    ScheduleModule,
    FacilityCategoryModule,
    MonitoringModule,
  ],
  controllers: [AppController, AuthController, FileUploadController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    AuthService,
    WSGateway,
    MonitoringService,
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
  ],
})
export class AppModule {}
