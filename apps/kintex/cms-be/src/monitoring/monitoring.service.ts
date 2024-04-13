import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonitoringService {
  constructor(private prisma: PrismaService) {}

  async getAllKiosks() {
    return this.prisma.monitoring.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async updateAllKioskCheckTime() {
    return this.prisma.monitoring.updateMany({
      data: {
        checkTime: new Date(),
      },
    });
  }

  async updateKiosk(code: string, image: string) {
    return this.prisma.monitoring.update({
      where: {
        code,
      },
      data: {
        data: image,
        checkTime: new Date(),
        network: true,
      },
    });
  }

  async reset() {
    return this.prisma.monitoring.updateMany({
      data: {
        data: '',
        checkTime: new Date(),
        network: false,
      },
    });
  }
}
