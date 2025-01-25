
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Commentaire, Prisma } from '@prisma/client';
import { CommentairePaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';
import { localEvents } from 'src/global/share/events/event-list';

@Injectable()
export class CommentaireService {
  private readonly logger = new LoggerService(CommentaireService.name);
  constructor(private prismaService: PrismaService) { }

  async findSingleCommentaire(
    { id }: { id: string }
  ): Promise<ReturnApiType<Commentaire | null>> {

    try {
      const commentaire = await this.prismaService.commentaire.findUnique({
        where: {
          id
        },
      });
      if (!commentaire) {
        return {
          status: 404,
          message: 'il n\'existe pas de commentaire avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la commentaire a ete trouvee',
          data: commentaire,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching commentaire with id ${id} \n\n ${error}`,
        CommentaireService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la commentaire d'identifiant` + id,
      );
    }
  }

  async findAllComments(params: CommentairePaginationParams) {
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
        createdAt: 'desc' as const,
      },
    };

    try {
      const [total, comments] = await this.prismaService.$transaction([
        this.prismaService.commentaire.count({ where }),
        this.prismaService.commentaire.findMany(queryOptions),
      ]);
      if (typeof comments != 'undefined' && comments.length) {
        return {
          status: 200,
          message: 'les commentaires ont ete recherchees avec succes!',
          data: comments,
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les commentaires n\'ont pas ete trouvees',
          data: [],
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      }
    } catch (error) {

      this.logger.error(
        `Error while fetching comments \n\n ${error}`,
        CommentaireService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des comments');
    }
  }

  async createCommentaire(data: Prisma.CommentaireCreateInput) {

    try {
      const commentaire = await this.prismaService.commentaire.create({
        data,
      });
      if (commentaire) {
        return {
          status: 201,
          message: 'la commentaire a ete creee avec success',
          data: commentaire,
        };
      } else {
        return {
          status: 400,
          message: 'la commentaire n\'a pas ete creee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while creating commentaire \n\n ${error}`,
        CommentaireService.name,
      );
      throw new InternalServerErrorException('Error durant la creation de la commentaire');
    }
  }

  async updateCommentaire(params: {
    where: Prisma.CommentaireWhereUniqueInput;
    data: Prisma.CommentaireUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.commentaire.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de commentaire avec cet identifiant',
          data: null,
        };

      const commentaire = await this.prismaService.commentaire.update({
        where,
        data,
      });
      if (commentaire) {
        return {
          status: 200,
          message: 'la commentaire a ete modifiee avec success',
          data: commentaire,
        };
      } else {
        return {
          status: 400,
          message: 'la commentaire n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating commentaire \n\n ${error}`,
        CommentaireService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la commentaire');
    }

  }

  async deleteCommentaire(where: Prisma.CommentaireWhereUniqueInput) {
    try {
      const commentaire = await this.prismaService.commentaire.findUnique({
        where,
      });
      if (!commentaire) {
        return {
          status: 404,
          message: 'il n\'existe pas de commentaire avec cet identifiant',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.commentaire.delete({
          where
        })
        return {
          status: 200,
          message: 'la commentaire a ete supprimee avec success',
          data: deletedPub,
        };
      }

    } catch (error) {
      this.logger.error(
        `Error while deleting commentaire \n\n ${error}`,
        CommentaireService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la commentaire');
    }
  }
}
