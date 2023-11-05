import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async createSection(data: Prisma.SectionUncheckedCreateInput) {
    return this.prisma.section.create({ data });
  }

  // async mergeSectionGroup(data: number[]) {
  //   const group = await this.prisma.sectionGroup.create({ data: {} });
  //   return Promise.all(
  //     data.map((id) => {
  //       return this.updateSection(id, { groupId: group.id });
  //     }),
  //   );
  // }

  // async splitSectionGroup(id: number) {
  //   await this.prisma.mapArea.updateMany({
  //     where: { groupId: id },
  //     data: { groupId: null },
  //   });

  //   return await this.prisma.mapAreaGroup.delete({ where: { id } });
  // }

  async getAllSections(): Promise<any[]> {
    return this.prisma.section.findMany();
  }

  async getSectionsByMapId(mapId: number) {
    return this.prisma.section.findMany({
      where: { mapId },
    });
  }

  async getSectionById(id: number) {
    return this.prisma.section.findUnique({ where: { id } });
  }

  async getMapById(id: number) {
    return this.prisma.map.findUnique({ where: { id } });
  }

  async deleteSection(id: number) {
    return this.prisma.section.delete({ where: { id } });
  }

  async updateSection(id: number, data: Prisma.SectionUpdateInput) {
    return this.prisma.section.update({ where: { id }, data });
  }
}
