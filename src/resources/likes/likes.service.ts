
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Likes, Prisma } from '@prisma/client';
import { LikesPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';


@Injectable()
export class LikesService {
  private readonly logger = new LoggerService(LikesService.name);
  constructor(private prismaService: PrismaService) { }

  async findSingleLike(
    { id }: { id: string }
  ): Promise<ReturnApiType<Likes | null>> {

    try {
      const likes = await this.prismaService.likes.findUnique({
        where: {
          id
        },
      });
      if (!likes) {
        return {
          status: 404,
          message: 'il n\'existe pas de likes avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la likes a ete trouvee',
          data: likes,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching likes with id ${id} \n\n ${error}`,
        LikesService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la likes d'identifiant` + id,
      );
    }
  }

  async findAllLikes(params: LikesPaginationParams) {
    const { page, perPage, cursor, orderBy, idPub, idUser, } = params;

    const where = {};

    if (idPub)
      where['idPub'] = idPub;
    if (idUser)
      where['idUser'] = idUser;

    const queryOptions = {
      where,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      cursor: cursor ?? undefined,
      orderBy: orderBy ? orderBy : {
        dateJaime: 'desc' as const,
      },
    };

    try {
      const [total, likess] = await this.prismaService.$transaction([
        this.prismaService.likes.count({ where }),
        this.prismaService.likes.findMany(queryOptions),
      ]);
      if (typeof likess != 'undefined' && likess.length) {
        return {
          status: 200,
          message: 'les likess ont ete recherchees avec succes!',
          data: likess,
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les likess n\'ont pas ete trouvees',
          data: [],
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      }
    } catch (error) {

      this.logger.error(
        `Error while fetching likess \n\n ${error}`,
        LikesService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des likess');
    }
  }

  async createLike(data: Prisma.LikesCreateInput) {

    try {
      const likes = await this.prismaService.likes.create({
        data,
      });
      if (likes) {
        return {
          status: 201,
          message: 'Vous avez ajoute cette publication a vos favoris',
          data: likes,
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
        `Error while creating likes \n\n ${error}`,
        LikesService.name,
      );
      throw new InternalServerErrorException('Error durant l\'ajout de cette publication a vos favoris');
    }
  }

  async updateLike(params: {
    where: Prisma.LikesWhereUniqueInput;
    data: Prisma.LikesUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.likes.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de likes avec cet identifiant',
          data: null,
        };

      const likes = await this.prismaService.likes.update({
        where,
        data,
      });
      if (likes) {
        return {
          status: 200,
          message: 'la likes a ete modifiee avec success',
          data: likes,
        };
      } else {
        return {
          status: 400,
          message: 'la likes n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating likes \n\n ${error}`,
        LikesService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la likes');
    }

  }

  async deleteLike(where: Prisma.LikesWhereUniqueInput) {
    try {
      const likes = await this.prismaService.likes.findUnique({
        where,
      });
      if (!likes) {
        return {
          status: 404,
          message: 'Cette publication n\'existe pas dans vos favoris',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.likes.delete({
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
        `Error while deleting likes \n\n ${error}`,
        LikesService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la likes');
    }
  }
}
