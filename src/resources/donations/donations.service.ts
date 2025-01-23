
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Donation, Prisma } from '@prisma/client';
import { DonationPaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class DonationService {
  constructor(private prismaService: PrismaService) { }

  async findSingleDonation(
    puDonationWhereUniqueInput: Prisma.DonationWhereUniqueInput,
  ): Promise<Donation | null> {
    return this.prismaService.donation.findUnique({
      where: puDonationWhereUniqueInput,
    });
  }

  async findAllDonations(params: DonationPaginationParams): Promise<Donation[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.donation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createDonation(data: Prisma.DonationCreateInput): Promise<Donation> {
    return this.prismaService.donation.create({
      data,
    });
  }

  async updateDonation(params: {
    where: Prisma.DonationWhereUniqueInput;
    data: Prisma.DonationUpdateInput;
  }): Promise<Donation> {
    const { where, data } = params;
    return this.prismaService.donation.update({
      data,
      where,
    });
  }

  async deleteDonation(where: Prisma.DonationWhereUniqueInput): Promise<Donation> {
    return this.prismaService.donation.delete({
      where,
    });
  }
}
