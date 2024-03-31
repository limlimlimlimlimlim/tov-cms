import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: Prisma.PostUncheckedCreateInput) {
    const count = await this.prisma.post.count();
    data.order = count + 1;
    return this.prisma.post.create({
      data,
    });
  }

  async swapPostOrder(postId1: number, postId2: number) {
    const post1 = await this.prisma.post.findFirst({
      where: { id: postId1 },
    });
    const post2 = await this.prisma.post.findFirst({
      where: { id: postId2 },
    });

    const post1Order = post1.order;
    const post2Order = post2.order;

    return await this.prisma.$transaction([
      this.prisma.post.update({
        where: {
          id: postId1,
        },
        data: {
          order: post2Order,
        },
      }),
      this.prisma.post.update({
        where: {
          id: postId2,
        },
        data: {
          order: post1Order,
        },
      }),
    ]);
  }

  async updateOrderPost(id: number, displacement: number) {
    const post1 = await this.prisma.post.findFirst({
      where: { id: id },
    });

    const maxOrderPost = await this.prisma.post.findFirst({
      orderBy: {
        order: 'desc',
      },
    });
    const minOrderPost = await this.prisma.post.findFirst({
      orderBy: {
        order: 'asc',
      },
    });

    if (
      post1.order + displacement > maxOrderPost.order ||
      post1.order + displacement < minOrderPost.order
    ) {
      throw new InternalServerErrorException();
    }

    const post2 = await this.prisma.post.findFirst({
      where: { order: post1.order + displacement },
    });

    return await this.swapPostOrder(post1.id, post2.id);
  }

  async getPosts({ keyword, page, count, startDate, endDate }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (startDate && endDate) {
      const start = dayjs(startDate).add(9, 'h').startOf('day');
      const end = dayjs(endDate).add(9, 'h').endOf('day');
      where.AND.push({
        createdAt: {
          gte: start,
          lte: end,
        },
      });
    }

    const total = await this.prisma.post.count({ where });
    const data = await this.prisma.post.findMany({
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        order: 'desc',
      },
    });
    return { total, data, page, count };
  }

  async getPostsByType({ type }) {
    const data = await this.prisma.post.findMany({
      where: {
        postType: type,
        status: 'enabled',
      },
      orderBy: {
        order: 'desc',
      },
    });
    return { data };
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

    await this.prisma.post.delete({
      where: { id },
    });

    const reorderTargets = await this.prisma.post.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    let count = 0;
    for (const i of reorderTargets) {
      await this.prisma.post.update({
        where: {
          id: i.id,
        },
        data: {
          order: ++count,
        },
      });
    }
  }
}
