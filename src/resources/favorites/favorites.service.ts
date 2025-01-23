
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Favorite, Prisma } from '@prisma/client';
import { FavoritePaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class FavoriteService {
  constructor(private prismaService: PrismaService) { }

  async findSingleFavorite(
    where: Prisma.FavoriteWhereUniqueInput,
  ): Promise<Favorite | null> {
    return this.prismaService.favorite.findUnique({
      where,
    });
  }

  async findAllFavorites(params: FavoritePaginationParams): Promise<Favorite[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.favorite.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createFavorite(data: Prisma.FavoriteCreateInput): Promise<Favorite> {
    return this.prismaService.favorite.create({
      data,
    });
  }

  async updateFavorite(params: {
    where: Prisma.FavoriteWhereUniqueInput;
    data: Prisma.FavoriteUpdateInput;
  }): Promise<Favorite> {
    const { where, data } = params;
    return this.prismaService.favorite.update({
      data,
      where,
    });
  }

  async deleteFavorite(where: Prisma.FavoriteWhereUniqueInput): Promise<Favorite> {
    return this.prismaService.favorite.delete({
      where,
    });
  }
}
