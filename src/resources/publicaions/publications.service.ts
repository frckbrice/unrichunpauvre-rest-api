
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Publication, Prisma } from '@prisma/client';
import { PublicationPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class PublicationService {
  private readonly logger = new LoggerService(PublicationService.name);
  constructor(private prismaService: PrismaService) { }

  async findSinglePublication(
    { id }: { id: string }
  ): Promise<ReturnApiType<Publication | null>> {

    try {
      const publication = await this.prismaService.publication.findUnique({
        where: {
          id
        },
      });
      if (!publication) {
        return {
          status: 404,
          message: 'il n\'existe pas de publication avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la publication a ete trouvee',
          data: publication,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching publication with id ${id} \n\n ${error}`,
        PublicationService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la publication d'identifiant` + id,
      );
    }
  }

  async findAllPublications(params: PublicationPaginationParams) {
    const { page, perPage, cursor, orderBy, searchString, etat } = params;

    const where = {};
    if (searchString) {
      where['libelePub'] = {
        contains: searchString,
        mode: 'insensitive',

      };
    }
    if (etat) {
      where['etat'] = etat
    }

    const queryOptions = {
      where,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      cursor,
      orderBy: orderBy ? orderBy : {
        datePub: 'desc' as const,
      },
    };

    try {
      const [total, pubs] = await this.prismaService.$transaction([
        this.prismaService.publication.count({ where }),
        this.prismaService.publication.findMany(queryOptions),
      ]);
      if (typeof pubs != 'undefined' && pubs.length) {
        return {
          status: 200,
          message: 'les reves ont ete recherchees avec succes!',
          data: pubs,
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les reves n\'ont pas ete trouvees',
          data: [],
          total,
          page: page ?? 0,
          perPage: perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (perPage ?? 20 - 1)),
        };
      }
    } catch (error) {

      this.logger.error(
        `Error while fetching publications \n\n ${error}`,
        PublicationService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des publications');
    }
  }

  async createPublication(data: Prisma.PublicationCreateInput) {

    try {
      const publication = await this.prismaService.publication.create({
        data,
      });
      if (publication) {
        return {
          status: 201,
          message: 'la publication a ete creee avec success',
          data: publication,
        };
      } else {
        return {
          status: 400,
          message: 'la publication n\'a pas ete creee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while creating publication \n\n ${error}`,
        PublicationService.name,
      );
      throw new InternalServerErrorException('Error durant la creation de la publication');
    }
  }

  async updatePublication(params: {
    where: Prisma.PublicationWhereUniqueInput;
    data: Prisma.PublicationUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.publication.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de publication avec cet identifiant',
          data: null,
        };

      const publication = await this.prismaService.publication.update({
        where,
        data,
      });
      if (publication) {
        return {
          status: 200,
          message: 'la publication a ete modifiee avec success',
          data: publication,
        };
      } else {
        return {
          status: 400,
          message: 'la publication n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating publication \n\n ${error}`,
        PublicationService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la publication');
    }

  }

  async deletePublication(where: Prisma.PublicationWhereUniqueInput) {
    try {
      const publication = await this.prismaService.publication.findUnique({
        where,
      });
      if (!publication) {
        return {
          status: 404,
          message: 'il n\'existe pas de publication avec cet identifiant',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.publication.delete({
          where
        })
        return {
          status: 200,
          message: 'la publication a ete supprimee avec success',
          data: deletedPub,
        };
      }

    } catch (error) {
      this.logger.error(
        `Error while deleting publication \n\n ${error}`,
        PublicationService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la publication');
    }
  }
}
