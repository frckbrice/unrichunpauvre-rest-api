
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Likes, Prisma } from '@prisma/client';
import { LikesPaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class LikesService {
  constructor(private prismaService: PrismaService) { }

  async findSingleLikes(
    puLikesWhereUniqueInput: Prisma.LikesWhereUniqueInput,
  ): Promise<Likes | null> {
    return this.prismaService.likes.findUnique({
      where: puLikesWhereUniqueInput,
    });
  }

  async findAllLikes(params: LikesPaginationParams): Promise<Likes[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.likes.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLikes(data: Prisma.LikesCreateInput): Promise<Likes> {
    return this.prismaService.likes.create({
      data,
    });
  }

  async updateLikes(params: {
    where: Prisma.LikesWhereUniqueInput;
    data: Prisma.LikesUpdateInput;
  }): Promise<Likes> {
    const { where, data } = params;
    return this.prismaService.likes.update({
      data,
      where,
    });
  }

  async deleteLikes(where: Prisma.LikesWhereUniqueInput): Promise<Likes> {
    return this.prismaService.likes.delete({
      where,
    });
  }
}
