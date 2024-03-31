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
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() data: Prisma.PostUncheckedCreateInput) {
    return this.postService.createPost(data);
  }

  @Get()
  async getPosts(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.postService.getPosts({
      keyword,
      page,
      count,
      startDate,
      endDate,
    });
  }

  @Get('/type/:type')
  async getPostsByType(@Param('type') type: string = 'conference') {
    const posts = await this.postService.getPostsByType({
      type,
    });

    const now = dayjs().valueOf();
    const result = posts.data.filter((post: any) => {
      if (post.noPeriod) {
        return true;
      }
      if (
        dayjs(post.startDate).startOf('day').valueOf() < now &&
        now < dayjs(post.endDate).endOf('day').valueOf()
      ) {
        return true;
      }
      return false;
    });
    return result;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(+id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() data: Prisma.KioskUpdateInput,
  ) {
    return this.postService.updatePost(+id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.postService.deletePost(+id);
  }

  @Patch('/order/increment/:id')
  async incrementOrderSchedule(@Param('id') id: string) {
    return this.postService.updateOrderPost(+id, +1);
  }

  @Patch('/order/decrement/:id')
  async decrementOrderSchedule(@Param('id') id: string) {
    return this.postService.updateOrderPost(+id, -1);
  }
}
