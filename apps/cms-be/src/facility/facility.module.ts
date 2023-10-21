import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService, PrismaService],
})
export class FacilityModule {}
