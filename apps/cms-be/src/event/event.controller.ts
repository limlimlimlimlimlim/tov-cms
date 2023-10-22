import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Prisma } from '@prisma/client';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() data: Prisma.EventCreateInput) {
    return this.eventService.createEvent(data);
  }

  @Get()
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: number) {
    const event = await this.eventService.getEventById(+id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: number,
    @Body() data: Prisma.EventUpdateInput,
  ) {
    const event = await this.eventService.getEventById(+id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.eventService.updateEvent(+id, data);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: number) {
    const event = await this.eventService.getEventById(+id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.eventService.deleteEvent(+id);
  }
}
