import { Module } from '@nestjs/common';
import { FacilityCategoryService } from './facility-category.service';
import { FacilityCategoryController } from './facility-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FacilityCategoryController],
  providers: [FacilityCategoryService, PrismaService],
})
export class FacilityCategoryModule {}
