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
}
