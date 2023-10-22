import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ConflictException,
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

  @Post('area')
  async createMapArea(@Body() data: Prisma.MapAreaCreateInput) {
    const map = await this.mapService.getMapById(data.mapId);

    if (!map) {
      throw new NotFoundException('Map not found.');
    }

    return await this.mapService.createMapArea(data);
  }

  @Post('area-group/merge')
  async mergeMapArea(@Body() data: { areas: number[] }) {
    return await this.mapService.mergeMapAreaGroup(data.areas);
  }

  @Post('area-group/:id/split')
  async splitMapArea(@Param('id') id: number) {
    return await this.mapService.splitMapAreaGroup(+id);
  }

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

  @Get('area/:mapId')
  async getMapAreasByMapId(@Param('mapId') mapId: number) {
    return await this.mapService.getMapAreasByMapId(+mapId);
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

  @Patch('area/:id')
  async updateMapArea(
    @Param('id') id: number,
    @Body() data: Prisma.MapAreaUpdateInput,
  ) {
    const sameArea = await this.mapService.getMapAreaById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map area not found.');
    }
    return this.mapService.updateMapArea(+id, data);
  }

  @Delete(':id')
  async deleteMap(@Param('id') id: number) {
    const sameMap = await this.getMapById(+id);
    if (!sameMap) {
      throw new NotFoundException('Map not found.');
    }
    return this.mapService.deleteMap(+id);
  }

  @Delete('area/:id')
  async deleteMapArea(@Param('id') id: number) {
    const sameArea = await this.mapService.getMapAreaById(+id);
    if (!sameArea) {
      throw new NotFoundException('Map area not found.');
    }
    return this.mapService.deleteMapArea(+id);
  }
}
