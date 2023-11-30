import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async createSection(data: Prisma.SectionUncheckedCreateInput) {
    return this.prisma.section.create({ data });
  }

  async createSectionsGroup(sections: string[]) {
    const group = await this.prisma.sectionGroup.create({ data: {} });
    return Promise.all(
      sections.map((id) => {
        return this.updateSection(Number(id), { groupId: group.id });
      }),
    );
  }

  async deleteSectionGroup(groupId: number) {
    await this.prisma.section.updateMany({
      where: { groupId },
      data: { groupId: null },
    });
    return await this.prisma.sectionGroup.delete({ where: { id: groupId } });
  }

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

  async updateSection(id: number, data: Prisma.SectionUncheckedUpdateInput) {
    console.log(id, typeof data.disabled, data.disabled);
    return this.prisma.section.update({ where: { id }, data });
  }
}
