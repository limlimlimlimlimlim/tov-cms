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
import * as fs from 'fs'; // fs 모듈 추가

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async createSchedule(@Body() data: Prisma.ScheduleUncheckedCreateInput) {
    return this.scheduleService.createSchedule(data);
  }

  @Get()
  async getSchedules(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.scheduleService.getSchedules({
      keyword,
      page,
      count,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  async getScheduleById(@Param('id') id: string) {
    return this.scheduleService.getScheduleById(+id);
  }

  @Patch(':id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() data: Prisma.ScheduleUpdateInput,
  ) {
    const s = await this.scheduleService.getScheduleById(+id);
    const { imageContents, videoContents } = s;
    const uploadDirectory = './files/upload/'; // 업로드 폴더 경로

    if (
      data.imageContents &&
      imageContents &&
      data.imageContents !== imageContents
    ) {
      if (fs.existsSync(`${uploadDirectory}${imageContents}`)) {
        fs.unlinkSync(`${uploadDirectory}${imageContents}`);
      }
    }

    if (
      data.videoContents &&
      videoContents &&
      data.videoContents !== videoContents
    ) {
      if (fs.existsSync(`${uploadDirectory}${videoContents}`)) {
        fs.unlinkSync(`${uploadDirectory}${videoContents}`);
      }
    }
    return this.scheduleService.updateSchedule(+id, data);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') id: string) {
    const s = await this.scheduleService.getScheduleById(+id);
    const { imageContents, videoContents } = s;
    const uploadDirectory = './files/upload/'; // 업로드 폴더 경로
    if (imageContents) {
      if (fs.existsSync(`${uploadDirectory}${imageContents}`)) {
        fs.unlinkSync(`${uploadDirectory}${imageContents}`);
      }
    }

    if (videoContents) {
      if (fs.existsSync(`${uploadDirectory}${videoContents}`)) {
        fs.unlinkSync(`${uploadDirectory}${videoContents}`);
      }
    }
    return this.scheduleService.deleteSchedule(+id);
  }

  @Get('/order/:order')
  async getScheduleByOrder(@Param('order') order: string) {
    return this.scheduleService.getScheduleByOrder(+order);
  }

  @Patch(':id/order')
  async upateScheduleOrder(
    @Param('id') id: string,
    @Body('order') order: string,
  ) {
    const sameOrderSchedule = await this.getScheduleByOrder(order);

    if (sameOrderSchedule) {
      const currentSchedule = await this.scheduleService.getScheduleById(+id);
      await this.scheduleService.updateSchedule(sameOrderSchedule.id, {
        order: currentSchedule.order,
      });
    }
    return this.scheduleService.updateSchedule(+id, { order: +order });
  }

  @Patch('/order/swap/:id1/:id2')
  async swapScheduleOrder(
    @Param('id1') id1: string,
    @Param('id2') id2: string,
  ) {
    return this.scheduleService.swapScheduleOrder(+id1, +id2);
  }

  @Patch('/order/increment/:id')
  async incrementOrderSchedule(@Param('id') id: string) {
    return this.scheduleService.updateOrderSchedule(+id, +1);
  }

  @Patch('/order/decrement/:id')
  async decrementOrderSchedule(@Param('id') id: string) {
    return this.scheduleService.updateOrderSchedule(+id, -1);
  }
}
