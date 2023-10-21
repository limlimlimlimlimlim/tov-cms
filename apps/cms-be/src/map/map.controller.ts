// map/map.controller.ts
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
} from '@nestjs/common';
import { MapService } from './map.service';
import { Prisma } from '@prisma/client';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  async createMap(@Body() data: Prisma.MapCreateInput) {
    const isExist = await this.mapService.existMapByFloorAndBuildning(
      data.floorId,
      data.buildingId,
    );
    if (isExist) {
      throw new ConflictException('Map already exists.');
    }
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
    console.log(data);
    return await this.mapService.mergeMapAreaGroup(data.areas);
  }

  @Post('area-group/:id/split')
  async splitMapArea(@Param('id') id: number) {
    return await this.mapService.splitMapAreaGroup(+id);
  }

  @Get()
  async getAllMaps() {
    return await this.mapService.getAllMaps();
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
