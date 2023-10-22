import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: Prisma.EventCreateInput) {
    return this.prisma.event.create({ data });
  }

  async getAllEvents() {
    return this.prisma.event.findMany();
  }

  async getEventById(id: number) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async updateEvent(id: number, data: Prisma.EventUpdateInput) {
    return this.prisma.event.update({ where: { id }, data });
  }

  async deleteEvent(id: number) {
    return this.prisma.event.delete({ where: { id } });
  }
}
