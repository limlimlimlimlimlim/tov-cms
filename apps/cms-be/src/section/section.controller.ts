import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { Prisma } from '@prisma/client';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async createSection(@Body() data: Prisma.SectionUncheckedCreateInput) {
    return await this.sectionService.createSection(data);
  }

  @Get('map/:mapId')
  async getSectionsByMapId(@Param('mapId') mapId: number) {
    return await this.sectionService.getSectionsByMapId(+mapId);
  }

  @Patch(':id')
  async updateSection(
    @Param('id') id: number,
    @Body() data: Prisma.SectionUpdateInput,
  ) {
    const sameArea = await this.sectionService.getSectionById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map section not found.');
    }
    return this.sectionService.updateSection(+id, data);
  }

  @Delete(':id')
  async deleteSection(@Param('id') id: number) {
    const sameArea = await this.sectionService.getSectionById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map section not found.');
    }
    return this.sectionService.deleteSection(+id);
  }

  @Post('/group')
  async createSections(@Body() { sectionIds }: any) {
    return this.sectionService.createSectionsGroup(sectionIds);
  }

  @Delete('/group/:id')
  async deleteSections(@Param('id') id: string) {
    return this.sectionService.deleteSectionGroup(+id);
  }
}
