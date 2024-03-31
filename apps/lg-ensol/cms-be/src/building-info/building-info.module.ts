import { Module } from '@nestjs/common';
import { BuildingInfoService } from './building-info.service';
import { BuildingInfoController } from './building-info.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BuildingInfoController],
  providers: [BuildingInfoService, PrismaService],
})
export class BuildingInfoModule {}
