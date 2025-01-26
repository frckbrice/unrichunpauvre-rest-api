
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Donation, Prisma } from '@prisma/client';
import { DonationPaginationParams } from 'src/global/utils/pagination';
import { ReturnApiType } from 'src/global/utils/return-type';
import { LoggerService } from 'src/global/logger/logger.service';
import { localEvents } from 'src/global/share/events/event-list';

@Injectable()
export class DonationService {
  private readonly logger = new LoggerService(DonationService.name);
  constructor(private prismaService: PrismaService) { }

  async findSingleDonation(
    { id }: { id: string }
  ): Promise<ReturnApiType<Donation | null>> {

    try {
      const donation = await this.prismaService.donation.findUnique({
        where: {
          id
        },
      });
      if (!donation) {
        return {
          status: 404,
          message: 'il n\'existe pas de donation avec cet identifiant',
          data: null,
        };
      } else
        return {
          status: 200,
          message: 'la donation a ete trouvee',
          data: donation,
        };
    } catch (error) {

      this.logger.error(
        `Error while fetching donation with id ${id} \n\n ${error}`,
        DonationService.name,
      );
      throw new InternalServerErrorException(
        `Erreur de recherche de la donation d'identifiant` + id,
      );
    }
  }

  async findAllDonations(params: DonationPaginationParams) {
    const { page, perPage, cursor, orderBy, idPub, idUser, } = params;

    const where = {};

    if (idPub)
      where['idPub'] = idPub;
    if (idUser)
      where['idUser'] = idUser;

    const queryOptions = {
      where,
      take: Number(perPage) ?? 20,
      skip: (Number(page) ?? 0) * (Number(perPage) ?? 20 - 1),
      cursor: cursor ?? undefined,
      orderBy: orderBy ? orderBy : {
        createdAt: 'desc' as const,
      },
    };

    try {
      const [total, donations] = await this.prismaService.$transaction([
        this.prismaService.donation.count({ where }),
        this.prismaService.donation.findMany(queryOptions),
      ]);
      if (typeof donations != 'undefined' && donations.length) {
        return {
          status: 200,
          message: 'les donations ont ete recherchees avec succes!',
          data: donations,
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 20 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
        };
      } else {
        return {
          status: 400,
          message: 'les donations n\'ont pas ete trouvees',
          data: [],
          total,
          page: Number(page) || 0,
          perPage: Number(perPage) ?? 20 - 1,
          totalPages: Math.ceil(total / (Number(perPage) ?? 20 - 1)),
        };
      }
    } catch (error) {

      this.logger.error(
        `Error while fetching donations \n\n ${error}`,
        DonationService.name,
      );
      throw new InternalServerErrorException('Error durant la recherche des donations');
    }
  }

  async createDonation(data: Prisma.DonationCreateInput) {

    try {
      const donation = await this.prismaService.donation.create({
        data,
      });
      if (donation) {
        return {
          status: 201,
          message: 'la donation a ete creee avec success',
          data: donation,
        };
      } else {
        return {
          status: 400,
          message: 'la donation n\'a pas ete creee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while creating donation \n\n ${error}`,
        DonationService.name,
      );
      throw new InternalServerErrorException('Error durant la creation de la donation');
    }
  }

  async updateDonation(params: {
    where: Prisma.DonationWhereUniqueInput;
    data: Prisma.DonationUpdateInput;
  }) {
    const { where, data } = params;
    try {
      const exitingPub = await this.prismaService.donation.findUnique({
        where,
      });
      if (!exitingPub)
        return {
          status: 404,
          message: 'il n\'existe pas de donation avec cet identifiant',
          data: null,
        };

      const donation = await this.prismaService.donation.update({
        where,
        data,
      });
      if (donation) {
        return {
          status: 200,
          message: 'la donation a ete modifiee avec success',
          data: donation,
        };
      } else {
        return {
          status: 400,
          message: 'la donation n\'a pas ete modifiee',
          data: null,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error while updating donation \n\n ${error}`,
        DonationService.name,
      );
      throw new InternalServerErrorException('Error durant la modification de la donation');
    }

  }

  async deleteDonation(where: Prisma.DonationWhereUniqueInput) {
    try {
      const donation = await this.prismaService.donation.findUnique({
        where,
      });
      if (!donation) {
        return {
          status: 404,
          message: 'il n\'existe pas de donation avec cet identifiant',
          data: null,
        };
      } else {
        const deletedPub = await this.prismaService.donation.delete({
          where
        })
        return {
          status: 200,
          message: 'la donation a ete supprimee avec success',
          data: deletedPub,
        };
      }

    } catch (error) {
      this.logger.error(
        `Error while deleting donation \n\n ${error}`,
        DonationService.name,
      );
      throw new InternalServerErrorException('Error durant la suppression de la donation');
    }
  }
}
