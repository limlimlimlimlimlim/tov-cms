import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  Patch,
  Query,
} from '@nestjs/common';
import { MapService } from './map.service';
import { Prisma } from '@prisma/client';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  async createMap(@Body() data: Prisma.MapCreateInput) {
    return await this.mapService.createMap(data);
  }

  @Post('section')
  async createSection(@Body() data: Prisma.SectionCreateInput) {
    const map = await this.mapService.getMapById(data.map.connect.id);

    if (!map) {
      throw new NotFoundException('Map not found.');
    }

    return await this.mapService.createSection(data);
  }

  // @Post('section-group/merge')
  // async mergeSection(@Body() data: { sections: number[] }) {
  //   return await this.mapService.mergeSectionGroup(data.sections);
  // }

  // @Post('section-group/:id/split')
  // async splitSection(@Param('id') id: number) {
  //   return await this.mapService.splitSectionGroup(+id);
  // }

  @Get()
  async getMaps(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('floor') floor: string,
    @Query('building') building: string,
  ) {
    return await this.mapService.getMaps(keyword, page, count, floor, building);
  }

  @Get('section/:mapId')
  async getSectionsByMapId(@Param('mapId') mapId: number) {
    return await this.mapService.getSectionsByMapId(+mapId);
  }

  @Get(':id')
  async getMapById(@Param('id') id: number) {
    return await this.mapService.getMapById(+id);
  }

  @Patch(':id')
  async updateMap(
    @Param('id') id: number,
    @Body() data: Prisma.MapUpdateInput,
  ) {
    const sameMap = await this.getMapById(+id);
    if (!sameMap) {
      throw new NotFoundException('Map not found.');
    }
    return this.mapService.updateMap(+id, data);
  }

  @Patch('section/:id')
  async updateSection(
    @Param('id') id: number,
    @Body() data: Prisma.SectionUpdateInput,
  ) {
    const sameArea = await this.mapService.getSectionById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map section not found.');
    }
    return this.mapService.updateSection(+id, data);
  }

  @Delete(':id')
  async deleteMap(@Param('id') id: number) {
    const sameMap = await this.getMapById(+id);
    if (!sameMap) {
      throw new NotFoundException('Map not found.');
    }
    return this.mapService.deleteMap(+id);
  }

  @Delete('section/:id')
  async deleteSection(@Param('id') id: number) {
    const sameArea = await this.mapService.getSectionById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map section not found.');
    }
    return this.mapService.deleteSection(+id);
  }
}
