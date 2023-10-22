import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Floor, Map, Prisma } from '@prisma/client';

interface MapWithFloorName extends Map {
  floor: Floor;
}
@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  async existMapByFloorAndBuildning(floorId: number, buildingId: number) {
    return this.prisma.map.findFirst({ where: { floorId, buildingId } });
  }

  async createMap(data: Prisma.MapCreateInput) {
    return this.prisma.map.create({ data });
  }

  async createMapArea(data: Prisma.MapAreaCreateInput) {
    return this.prisma.mapArea.create({ data });
  }

  async mergeMapAreaGroup(data: number[]) {
    const group = await this.prisma.mapAreaGroup.create({ data: {} });
    return Promise.all(
      data.map((id) => {
        return this.updateMapArea(id, { groupId: group.id });
      }),
    );
  }

  async splitMapAreaGroup(id: number) {
    await this.prisma.mapArea.updateMany({
      where: { groupId: id },
      data: { groupId: null },
    });

    return await this.prisma.mapAreaGroup.delete({ where: { id } });
  }

  async getMaps(
    keyword: string = '',
    page: string,
    count: string,
    floor: string,
    building: string,
  ) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (floor) {
      where.AND.push({ floorId: +floor });
    }
    if (building) {
      where.AND.push({ buildingId: +building });
    }

    const total = await this.prisma.map.count({ where });

    const data = await this.prisma.map.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        isUse: true,
        floor: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
      },
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        id: 'desc',
      },
    });
    return { total, data, page, count };
  }

  async getAllMapAreas(): Promise<any[]> {
    return this.prisma.mapArea.findMany();
  }

  async getMapAreasByMapId(mapId: number) {
    return this.prisma.mapArea.findMany({
      where: { mapId },
    });
  }

  async getMapById(id: number) {
    return this.prisma.map.findUnique({ where: { id } });
  }

  async getMapAreaById(id: number) {
    return this.prisma.mapArea.findUnique({ where: { id } });
  }

  async updateMap(id: number, data: Prisma.MapUpdateInput) {
    return this.prisma.map.update({ where: { id }, data });
  }

  async updateMapArea(id: number, data: Prisma.MapAreaUpdateInput) {
    return this.prisma.mapArea.update({ where: { id }, data });
  }

  async deleteMap(id: number) {
    return this.prisma.map.delete({ where: { id } });
  }

  async deleteMapArea(id: number) {
    return this.prisma.mapArea.delete({ where: { id } });
  }
}
