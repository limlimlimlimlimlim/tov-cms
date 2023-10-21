import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BuildingInfoService {
  constructor(private prisma: PrismaService) {}

  async createFloor(data: Prisma.FloorCreateInput) {
    return this.prisma.floor.create({ data });
  }

  async createBuilding(data: Prisma.BuildingCreateInput) {
    return this.prisma.building.create({ data });
  }

  async getAllFloors() {
    return this.prisma.floor.findMany();
  }

  async getAllBuildings() {
    return this.prisma.building.findMany();
  }

  async getFloorById(id: number) {
    return this.prisma.floor.findUnique({ where: { id } });
  }

  async getBuildingsByFloor(id: number) {
    return this.prisma.building.findMany({ where: { floorId: id } });
  }

  async getFloorByName(name: string) {
    return this.prisma.floor.findFirst({ where: { name } });
  }

  async getBuildingById(id: number) {
    return this.prisma.building.findUnique({ where: { id } });
  }

  async getBuildingByName(name: string) {
    return this.prisma.building.findFirst({ where: { name } });
  }

  async getFloorCount() {
    return this.prisma.floor.count();
  }

  async getBuildingCountByFoorId(id: number) {
    return this.prisma.building.count({ where: { floorId: id } });
  }

  async updateFloor(id: number, data: Prisma.FloorUpdateInput) {
    return this.prisma.floor.update({ where: { id }, data });
  }

  async updateBuilding(id: number, data: Prisma.BuildingUpdateInput) {
    return this.prisma.building.update({ where: { id }, data });
  }

  async deleteFloor(id: number) {
    return this.prisma.floor.delete({ where: { id } });
  }

  async deleteBuilding(id: number) {
    return this.prisma.building.delete({ where: { id } });
  }

  async swapFloor(id1: number, id2: number) {
    const floor1 = await this.getFloorById(id1);
    const floor2 = await this.getFloorById(id2);
    const tempOrder = (await floor1).order;
    return Promise.all([
      this.prisma.floor.update({
        where: { id: id1 },
        data: { order: floor2.order },
      }),
      this.prisma.floor.update({
        where: { id: id2 },
        data: { order: tempOrder },
      }),
    ]);
  }

  async swapBuilding(id1: number, id2: number) {
    const building1 = await this.getBuildingById(id1);
    const building2 = await this.getBuildingById(id2);
    const tempOrder = (await building1).order;

    return Promise.all([
      this.prisma.building.update({
        where: { id: id1 },
        data: { order: building2.order },
      }),
      this.prisma.building.update({
        where: { id: id2 },
        data: { order: tempOrder },
      }),
    ]);
  }
}
