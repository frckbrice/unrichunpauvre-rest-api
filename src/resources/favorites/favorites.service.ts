
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Favorite, Prisma } from '@prisma/client';
import { FavoritePaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';
import { PublicationService } from '../publications/publications.service';


@Injectable()
export class FavoriteService {
  private readonly logger = new LoggerService(FavoriteService.name);
  constructor(
    private prismaService: PrismaService,
    private publicationService: PublicationService
  ) { }

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
    const { page = 1, perPage = 20, cursor, orderBy, idPub, idUser } = params;

    const where: any = {};
    if (idPub) where.idPub = idPub;
    if (idUser) where.idUser = idUser;

    try {
      const [total, favorites] = await this.prismaService.$transaction([
        this.prismaService.favorite.count({ where }),
        this.prismaService.favorite.findMany({
          where,
          include: {
            // user: true,  // Fetch full user details
            pub: true,   // Fetch full publication details
          },
          take: Number(perPage),
          skip: (Number(page) - 1) * Number(perPage),  // Apply pagination logic
          // cursor: cursor ? { id: cursor } : undefined, // Ensure valid cursor format
          orderBy: orderBy ? orderBy : { createdAt: 'desc' },
        }),
      ]);



      return {
        status: favorites.length ? 200 : 400,
        message: favorites.length
          ? 'Les favoris ont été récupérés avec succès!'
          : 'Aucun favori trouvé',
        data: favorites?.map((favorite) => ({
          ...favorite,
          pub: {
            ...favorite.pub,
            idCat: favorite?.pub?.idCat,
            authorId: favorite?.pub?.idUser,

            datePub: favorite?.pub?.datePub.toISOString(),
            id: favorite?.pub?.id,
            imagePub: favorite?.pub?.imagePub,
            content: favorite?.pub?.libelePub,
          },
        })),
        total,
        page: Number(page),
        perPage: Number(perPage),
        totalPages: Math.ceil(total / Number(perPage)),
      };
    } catch (error) {
      this.logger.error(`Error while fetching favorites: ${error}`, FavoriteService.name);
      throw new InternalServerErrorException('Erreur lors de la récupération des favoris');
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

  // delte like with query params

  async deletesfavorite(idPub: string, idUser: string) {
    try {
      const like = await this.prismaService.favorite.findFirst({
        where: { idPub, idUser },
      });

      if (!like) {
        throw new NotFoundException('Like not found');
      }

      return await this.prismaService.favorite.delete({
        where: { id: like.id },
      });
    } catch (error) {
      this.logger.error(
        `Error while deleting likes with query params \n\n ${error}`,
        FavoriteService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression d\'un likes');
    }
  }
}
