
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Category, Prisma } from '@prisma/client';
import { CategoriesPaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) { }

  async findSingleCategory(
    puCategoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: puCategoryWhereUniqueInput,
    });
  }

  async findAllCategories(params: CategoriesPaginationParams): Promise<Category[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prismaService.category.create({
      data,
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { where, data } = params;
    return this.prismaService.category.update({
      data,
      where,
    });
  }

  async deleteCategory(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prismaService.category.delete({
      where,
    });
  }
}
