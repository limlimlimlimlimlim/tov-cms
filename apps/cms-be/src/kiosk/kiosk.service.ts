// kiosk.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class KioskService {
  constructor(private prisma: PrismaService) {}

  async createKiosk(data: Prisma.KioskCreateInput) {
    return this.prisma.kiosk.create({
      data,
    });
  }

  async getKiosks() {
    return this.prisma.kiosk.findMany();
  }

  async getKioskById(id: number) {
    return await this.prisma.kiosk.findUnique({
      where: { id },
    });
  }

  async updateKiosk(id: number, data: Prisma.KioskUpdateInput) {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: { id },
    });

    if (!kiosk) {
      throw new NotFoundException('Kiosk not found.');
    }

    return this.prisma.kiosk.update({
      where: { id },
      data,
    });
  }

  async deleteKiosk(id: number) {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: { id },
    });

    if (!kiosk) {
      throw new NotFoundException('Kiosk not found.');
    }

    return await this.prisma.kiosk.delete({
      where: { id },
    });
  }
}
