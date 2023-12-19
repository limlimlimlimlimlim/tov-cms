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
  ) {
    return await this.postService.getPosts({
      keyword,
      page,
      count,
    });
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
}
