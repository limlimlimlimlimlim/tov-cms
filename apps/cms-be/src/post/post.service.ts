import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: Prisma.PostUncheckedCreateInput) {
    return this.prisma.post.create({
      data,
    });
  }

  async getPosts({ keyword, page, count }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }

    const total = await this.prisma.post.count({ where });
    const data = await this.prisma.post.findMany({
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        id: 'desc',
      },
    });
    return { total, data, page, count };
  }

  async getPostById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  async updatePost(id: number, data: Prisma.PostUpdateInput) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
