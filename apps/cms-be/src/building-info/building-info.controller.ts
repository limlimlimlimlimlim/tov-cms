import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BuildingInfoService } from './building-info.service';
import { Prisma } from '@prisma/client';

@Controller('building-info')
export class BuildingInfoController {
  constructor(private readonly buildingInfoService: BuildingInfoService) {}

  @Post('floor')
  async createFloor(@Body() data: Prisma.FloorUncheckedCreateInput) {
    return await this.buildingInfoService.createFloor(data);
  }

  // @Post('floor/:floorId/add/:wingId')
  // async addWingToFloor(
  //   @Param('floorId') floorId: string,
  //   @Param('wingId') wingId: string,
  //   @Query('order') order?: string,
  // ) {
  //   const floor = await this.buildingInfoService.getFloorById(floorId);
  //   if (!floor) {
  //     return new NotFoundException();
  //   }

  //   const wing = await this.buildingInfoService.getWingById(wingId);
  //   if (!wing) {
  //     return new NotFoundException();
  //   }

  //   return await this.buildingInfoService.addWingToFloor({
  //     floorId: +floorId,
  //     wingId: +wingId,
  //     order: order !== undefined ? +order : undefined,
  //   });
  // }

  @Post('wing')
  async createWing(@Body() data: Prisma.WingUncheckedCreateInput) {
    return await this.buildingInfoService.createWing(data);
  }

  @Get('tree')
  async getWingFloorTree() {
    return await this.buildingInfoService.getWingFloorTree();
  }

  @Get('floors')
  async getAllFloors() {
    return await this.buildingInfoService.getAllFloors();
  }

  @Get('wings')
  async getAllWings() {
    return await this.buildingInfoService.getAllWings();
  }

  @Get('floor/:id')
  async getFloorById(@Param('id') id: string) {
    return await this.buildingInfoService.getFloorById(id);
  }

  @Get('wing/:id/floors')
  async getFloorsInWing(@Param('id') id: string) {
    return await this.buildingInfoService.getFloorsInWing(id);
  }

  @Get('floor/:id/wings')
  async getWingsInFloor(@Param('id') id: string) {
    return await this.buildingInfoService.getWingsInFloor(id);
  }

  @Get('floor/name/:name')
  async getFloorByName(
    @Param('name') name: string,
    @Query('lang') lang: 'ko' | 'en' = 'ko',
  ) {
    return await this.buildingInfoService.getFloorByName(name, lang);
  }

  @Get('wing/:id')
  async getWingById(@Param('id') id: string) {
    return await this.buildingInfoService.getWingById(id);
  }

  @Get('wing/name/:name')
  async getWingByName(@Param('name') name: string) {
    return await this.buildingInfoService.getWingByName(name);
  }

  @Patch('floor/:id')
  async updateFloor(
    @Param('id') id: string,
    @Body() data: Prisma.FloorUpdateInput,
  ) {
    const sameFloor = await this.getFloorById(id);
    if (!sameFloor) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.updateFloor(id, data);
  }

  @Patch('wing/:id')
  async updateWing(
    @Param('id') id: string,
    @Body() data: Prisma.WingUpdateInput,
  ) {
    const sameWing = await this.getWingById(id);
    if (!sameWing) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.updateWing(+id, data);
  }

  @Patch('floor/swap/:id1/:id2')
  async swapFloor(@Param('id1') id1: string, @Param('id2') id2: string) {
    const floor1 = await this.getFloorById(id1);

    if (!floor1) {
      throw new NotFoundException('Data not found.');
    }
    const floor2 = await this.getFloorById(id2);
    if (!floor2) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.swapFloors(id1, id2);
  }

  // @Patch('floor/:floorId/wing/swap/:id1/:id2')
  // async swapWing(
  //   @Param('floorId') floorId: string,
  //   @Param('id1') id1: string,
  //   @Param('id2') id2: string,
  // ) {
  //   return this.buildingInfoService.swapWings(floorId, id1, id2);
  // }

  @Delete('floor/:id')
  async deleteFloor(@Param('id') id: string) {
    const sameFloor = await this.getFloorById(id);
    if (!sameFloor) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.deleteFloor(id);
  }

  @Delete('wing/:wingId')
  async deleteWing(@Param('wingId') wingId: string) {
    const wing = await this.getWingById(wingId);
    if (!wing) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.deleteWing(wingId);
  }
}
