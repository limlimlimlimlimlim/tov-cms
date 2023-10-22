import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BuildingInfoService } from './building-info.service';
import { Prisma } from '@prisma/client';

@Controller('building-info')
export class BuildingInfoController {
  constructor(private readonly buildingInfoService: BuildingInfoService) {}

  @Post('floor')
  async createFloor(@Body() data: Prisma.FloorCreateInput) {
    const sameFloor = await this.getFloorByName(data.name);
    if (sameFloor) {
      throw new ConflictException('Data already exists.');
    }
    const count = await this.buildingInfoService.getFloorCount();
    data.order = count;
    return await this.buildingInfoService.createFloor(data);
  }

  @Post('building')
  async createBuilding(@Body() data: Prisma.BuildingCreateInput) {
    const sameBuilding = await this.getBuildingByName(data.name);
    if (sameBuilding && sameBuilding.floorId === +data.floorId) {
      throw new ConflictException('Data already exists.');
    }
    const count = await this.buildingInfoService.getBuildingCountByFoorId(
      +data.floorId,
    );
    data.order = count;
    return await this.buildingInfoService.createBuilding(data);
  }

  @Get('floors')
  async getAllFloors() {
    return await this.buildingInfoService.getAllFloors();
  }

  @Get('tree')
  async getBuildingInfoTree() {
    const floors = await this.buildingInfoService.getAllFloors();
    const buildings = await this.buildingInfoService.getAllBuildings();
    const result = floors.map((floor) => {
      const child = buildings.filter((building) => {
        return building.floorId === floor.id;
      });
      return { ...floor, child: child || [] };
    });
    return result;
  }

  @Get('buildings')
  async getAllBuildings() {
    return await this.buildingInfoService.getAllBuildings();
  }

  @Get('floor/:id')
  async getFloorById(@Param('id') id: number) {
    return await this.buildingInfoService.getFloorById(+id);
  }

  @Get('floor/:id/buildings')
  async getBuildingsByFloor(@Param('id') id: number) {
    return await this.buildingInfoService.getBuildingsByFloor(+id);
  }

  @Get('floor/name/:name')
  async getFloorByName(@Param('name') name: string) {
    return await this.buildingInfoService.getFloorByName(name);
  }

  @Get('building/:id')
  async getBuildingById(@Param('id') id: number) {
    return await this.buildingInfoService.getBuildingById(+id);
  }

  @Get('building/name/:name')
  async getBuildingByName(@Param('name') name: string) {
    return await this.buildingInfoService.getBuildingByName(name);
  }

  @Patch('floor/:id')
  async updateFloor(
    @Param('id') id: number,
    @Body() data: Prisma.FloorUpdateInput,
  ) {
    const sameFloor = await this.getFloorById(+id);
    if (!sameFloor) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.updateFloor(+id, data);
  }

  @Patch('building/:id')
  async updateBuilding(
    @Param('id') id: number,
    @Body() data: Prisma.BuildingUpdateInput,
  ) {
    const sameBuilding = await this.getBuildingById(+id);
    if (!sameBuilding) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.updateBuilding(+id, data);
  }

  @Patch('floor/swap/:id1/:id2')
  async swapFloor(@Param('id1') id1: number, @Param('id2') id2: number) {
    const floor1 = await this.getFloorById(+id1);

    if (!floor1) {
      throw new NotFoundException('Data not found.');
    }
    const floor2 = await this.getFloorById(+id2);
    if (!floor2) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.swapFloor(+id1, +id2);
  }

  @Patch('building/swap/:id1/:id2')
  async swapBuilding(@Param('id1') id1: number, @Param('id2') id2: number) {
    const building1 = await this.getBuildingById(+id1);
    if (!building1) {
      throw new NotFoundException('Data not found.');
    }
    const building2 = await this.getBuildingById(+id2);
    if (!building2) {
      throw new NotFoundException('Data not found.');
    }

    if (building1.floorId !== building2.floorId) {
      throw new BadRequestException('Invalid data input.');
    }
    return this.buildingInfoService.swapBuilding(+id1, +id2);
  }

  @Delete('floor/:id')
  async deleteFloor(@Param('id') id: number) {
    const sameFloor = await this.getFloorById(+id);
    if (!sameFloor) {
      throw new NotFoundException('Data not found.');
    }
    const child = await this.getBuildingsByFloor(+id);

    if (child && child.length > 0) {
      throw new ConflictException('Data deletion failed due to dependencies.');
    }

    return this.buildingInfoService.deleteFloor(+id);
  }

  @Delete('building/:id')
  async deleteBuilding(@Param('id') id: number) {
    const sameBuilding = await this.getBuildingById(+id);
    if (!sameBuilding) {
      throw new NotFoundException('Data not found.');
    }
    return this.buildingInfoService.deleteBuilding(+id);
  }
}
