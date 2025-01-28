
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Favorite, Prisma } from '@prisma/client';
import { FavoritePaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';


@Injectable()
export class FavoriteService {
  private readonly logger = new LoggerService(FavoriteService.name);
  constructor(private prismaService: PrismaService) { }

  async findSingleFavorite(
    { id }: { id: string }
  ): Promise<ReturnApiType<Favorite | null>> {

    try {
      const favorite = await this.prismaService.favorite.findUnique({
        where: {
          id
        },
      });
      if (!favorite) {
        return {
          status: 404,
          message: 'il n\'existe pas de favorite avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la favorite a ete trouvee',
          data: favorite,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching favorite with id ${id} \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la favorite d'identifiant` + id,
      );
    }
  }

  async findAllFavorites(params: FavoritePaginationParams) {
    const { page, perPage, cursor, orderBy, idPub, idUser, } = params;

    const where = {};

    if (idPub)
      where['idPub'] = idPub;
    if (idUser)
      where['idUser'] = idUser;

    const queryOptions = {
      where,
      orderBy: orderBy ? orderBy : {
        createdAt: 'desc' as const,
      },
    };

    try {
      const [total, favorites] = await this.prismaService.$transaction([
        this.prismaService.favorite.count({ where }),
        this.prismaService.favorite.findMany(queryOptions),
      ]);
      if (typeof favorites != 'undefined' && favorites.length) {
        return {
          status: 200,
          message: 'les favoris ont ete recherchees avec succes!',
          data: favorites,
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 20 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les favoris n\'ont pas ete trouvees',
          data: [],
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 20 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while fetching favorites \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des favorites');
    }
  }

  async createFavorite(data: Prisma.FavoriteCreateInput) {

    try {
      const favorite = await this.prismaService.favorite.create({
        data,
      });
      if (favorite) {
        return {
          status: 201,
          message: 'Vous avez ajoute cette publication a vos favoris',
          data: favorite,
        };
      } else {
        return {
          status: 400,
          message: 'Desole vous n\'avez pas ajoute cette publication a vos favoris',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while creating favorite \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException('Error durant l\'ajout de cette publication a vos favoris');
    }
  }

  async updateFavorite(params: {
    where: Prisma.FavoriteWhereUniqueInput;
    data: Prisma.FavoriteUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.favorite.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de favorite avec cet identifiant',
          data: null,
        };

      const favorite = await this.prismaService.favorite.update({
        where,
        data,
      });
      if (favorite) {
        return {
          status: 200,
          message: 'la favorite a ete modifiee avec success',
          data: favorite,
        };
      } else {
        return {
          status: 400,
          message: 'la favorite n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating favorite \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la favorite');
    }
  }


  async deleteFavorite(where: Prisma.FavoriteWhereUniqueInput) {
    try {
      const favorite = await this.prismaService.favorite.findUnique({
        where,
      });
      if (!favorite) {
        return {
          status: 404,
          message: 'Cette publication n\'existe pas dans vos favoris',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.favorite.delete({
          where
        })
        return {
          status: 200,
          message: 'Vous avez retire cette publication a vos favoris',
          data: deletedPub,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while deleting favorite \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la favorite');
    }
  }
}
