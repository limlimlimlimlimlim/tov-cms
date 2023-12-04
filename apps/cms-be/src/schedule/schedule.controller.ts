import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Prisma } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async createSchedule(@Body() data: Prisma.PostUncheckedCreateInput) {
    return this.scheduleService.createSchedule(data);
  }

  @Get()
  async getSchedules(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('floorId') floorId: string,
    @Query('wingId') wingId: string,
  ) {
    return await this.scheduleService.getSchedules({
      keyword,
      page,
      count,
      floorId,
      wingId,
    });
  }

  @Get(':id')
  async getScheduleById(@Param('id') id: string) {
    return this.scheduleService.getScheduleById(+id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() data: Prisma.KioskUpdateInput,
  ) {
    return this.scheduleService.updateSchedule(+id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
