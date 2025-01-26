
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Category, Prisma } from '@prisma/client';
import { CategoriesPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';
import { localEvents } from 'src/global/share/events/event-list';

@Injectable()
export class CategoryService {
  private readonly logger = new LoggerService(CategoryService.name);
  constructor(private prismaService: PrismaService) { }

  async findSingleCategory(
    { id }: { id: string }
  ): Promise<ReturnApiType<Category | null>> {

    try {
      const category = await this.prismaService.category.findUnique({
        where: {
          id
        },
      });
      if (!category) {
        return {
          status: 404,
          message: 'il n\'existe pas de category avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la category a ete trouvee',
          data: category,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching category with id ${id} \n\n ${error}`,
        CategoryService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la category d'identifiant` + id,
      );
    }
  }

  async findAllCategories(params: CategoriesPaginationParams) {

    try {
      const [total, categories] = await this.prismaService.$transaction([
        this.prismaService.category.count({}),
        this.prismaService.category.findMany({}),
      ]);
      if (typeof categories != 'undefined' && categories.length) {
        return {
          status: 200,
          message: 'les category ont ete recherchees avec succes!',
          data: categories,
          total,
        };
      } else {
        return {
          status: 400,
          message: 'les category n\'ont pas ete trouvees',
          data: [],
          total,
        };
      }
    } catch (error) {

      this.logger.error(
        `Error while fetching categories \n\n ${error}`,
        CategoryService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des categories');
    }
  }

  async createCategory(data: Prisma.CategoryCreateInput) {

    try {
      const category = await this.prismaService.category.create({
        data,
      });
      if (category) {
        return {
          status: 201,
          message: 'la category a ete creee avec success',
          data: category,
        };
      } else {
        return {
          status: 400,
          message: 'la category n\'a pas ete creee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while creating category \n\n ${error}`,
        CategoryService.name,
      );
      throw new InternalServerErrorException('Error durant la creation de la category');
    }
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.category.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de category avec cet identifiant',
          data: null,
        };

      const category = await this.prismaService.category.update({
        where,
        data,
      });
      if (category) {
        return {
          status: 200,
          message: 'la category a ete modifiee avec success',
          data: category,
        };
      } else {
        return {
          status: 400,
          message: 'la category n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating category \n\n ${error}`,
        CategoryService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la category');
    }

  }

  async deleteCategory(where: Prisma.CategoryWhereUniqueInput) {
    try {
      const category = await this.prismaService.category.findUnique({
        where,
      });
      if (!category) {
        return {
          status: 404,
          message: 'il n\'existe pas de category avec cet identifiant',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.category.delete({
          where
        })
        return {
          status: 200,
          message: 'la category a ete supprimee avec success',
          data: deletedPub,
        };
      }

    } catch (error) {
      this.logger.error(
        `Error while deleting category \n\n ${error}`,
        CategoryService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la category');
    }
  }
}
