
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
        include: {
          user: true,
          commentaires: true,
          likes: true,
          favorites: true
        }
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
          message: 'la publication a ete trouvée',
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
    const { page, perPage, cursor, orderBy, searchString, etat, idCat, idUser } = params;

    console.log("\n\n params: ", params);
    const where = {};
    let take: number | undefined = undefined, skip: number | undefined = undefined;
    if (searchString) {
      where['libelePub'] = {
        contains: searchString,
        mode: 'insensitive',
      };
    }
    if (etat) {
      where['etat'] = etat;
    }

    if (idUser)
      where['idUser'] = idUser;

    if (idCat)
      where['idCat'] = idCat;

    if (perPage && Number(perPage) > 10)
      take = +perPage as number;
    if (page && Number(page) > 0 && take)
      skip = (+page - 1) * (+take - 1);

    const queryOptions = {
      where: {
        ...where,
      },
      include: {
        likes: true,
        commentaires: true,
        user: true,
        favorites: true
      },
      take,
      skip,
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
      console.log("\n\n pubs: ", pubs);
      if (typeof pubs != 'undefined' && pubs.length) {
        return {
          status: 200,
          message: 'les reves ont ete recherchées avec succes!',
          data: pubs,
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 10 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 10 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les reves n\'ont pas ete trouvées',
          data: [],
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 10 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 10 - 1)),
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

  async createPublication(data: Publication) {

    // console.log("\n\n incoming data: ", data);

    try {
      // In your Prisma service
      const publication = await this.prismaService.publication.create({
        data: {
          imagePub: data.imagePub,
          documentUrl: data.documentUrl,
          datePub: new Date(data.datePub),
          libelePub: data.libelePub,
          etat: data.etat,
          montantEstime: data.montantEstime,
          idCat: data.idCat,
          idUser: data.idUser
        }
      })
      if (publication) {
        return {
          status: 201,
          message: 'la publication a ete créee avec success',
          data: publication,
        };
      } else {
        return {
          status: 400,
          message: 'Erreur, la publication n\'a pas ete créee',
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
          message: 'la publication a ete modifiée avec success',
          data: publication,
        };
      } else {
        return {
          status: 400,
          message: 'la publication n\'a pas ete modifiée',
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
          message: 'la publication a ete supprimée avec success',
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
