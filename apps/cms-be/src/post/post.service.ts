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

  async getPosts({ keyword, page, count, floorId, wingId }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (floorId) {
      where.AND.push({ floorId: +floorId });
    }
    if (wingId) {
      where.AND.push({ wingId: +wingId });
    }

    const total = await this.prisma.post.count({ where });
    const data = await this.prisma.post.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        imageContents: true,
        videoContents: true,
        textContents: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        endDate: true,
        status: true,
        useIntro: true,
        wing: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
      },
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
