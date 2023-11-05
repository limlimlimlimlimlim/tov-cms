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

  @Get()
  async getMaps(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('floorId') floorId: string,
    @Query('wing') wingId: string,
  ) {
    return await this.mapService.getMaps(keyword, page, count, floorId, wingId);
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

  @Delete(':id')
  async deleteMap(@Param('id') id: number) {
    const sameMap = await this.getMapById(+id);
    if (!sameMap) {
      throw new NotFoundException('Map not found.');
    }
    return this.mapService.deleteMap(+id);
  }
}
