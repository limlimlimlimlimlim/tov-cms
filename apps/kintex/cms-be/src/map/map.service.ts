import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  async existMapByFloorAndBuildning(floorId: number, wingId: number) {
    return this.prisma.map.findFirst({ where: { floorId, wingId } });
  }

  async createMap(data: Prisma.MapCreateInput) {
    return this.prisma.map.create({ data });
  }

  async getMapById(id: number) {
    return this.prisma.map.findUnique({
      select: {
        id: true,
        name: true,
        nameEn: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        isUse: true,
        sectionBase64: true,
        floor: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
        wing: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },

        sections: {
          select: {
            id: true,
            path: true,
            facilities: true,
            groupId: true,
            color: true,
            alpha: true,
            strokeColor: true,
            strokeAlpha: true,
            strokeWidth: true,
            disabled: true,
            group: {
              select: {
                id: true,
                sections: true,
              },
            },
          },
        },
      },
      where: { id },
    });
  }

  async getMaps({ keyword, page, count, floorId, wingId }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (floorId) {
      where.AND.push({ floorId: +floorId });
    }
    if (wingId) {
      where.AND.push({ wingId: +wingId });
    }

    const total = await this.prisma.map.count({ where });

    const data = await this.prisma.map.findMany({
      select: {
        id: true,
        name: true,
        nameEn: true,
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
        wing: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
        sections: {
          select: {
            id: true,
            path: true,
            facilities: true,
            color: true,
            alpha: true,
            strokeColor: true,
            strokeAlpha: true,
            strokeWidth: true,
            group: {
              select: {
                id: true,
                sections: true,
              },
            },
            groupId: true,
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

  async updateMap(id: number, data: Prisma.MapUpdateInput) {
    return this.prisma.map.update({ where: { id }, data });
  }

  async deleteMap(id: number) {
    await this.prisma.section.deleteMany({ where: { mapId: id } });
    return this.prisma.map.delete({ where: { id } });
  }
}
