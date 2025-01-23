
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Publication, Prisma } from '@prisma/client';
import { PublicationPaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class PublicationService {
  constructor(private prismaService: PrismaService) { }

  async findSinglePublication(
    { id }: { id: string }
  ): Promise<Publication | null> {
    return this.prismaService.publication.findUnique({
      where: {
        id
      },
    });
  }

  async findAllPublications(params: PublicationPaginationParams): Promise<Publication[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.publication.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPublication(data: Prisma.PublicationCreateInput): Promise<Publication> {
    return this.prismaService.publication.create({
      data,
    });
  }

  async updatePublication(params: {
    where: Prisma.PublicationWhereUniqueInput;
    data: Prisma.PublicationUpdateInput;
  }): Promise<Publication> {
    const { where, data } = params;
    return this.prismaService.publication.update({
      data,
      where,
    });
  }

  async deletePublication(where: Prisma.PublicationWhereUniqueInput): Promise<Publication> {
    return this.prismaService.publication.delete({
      where,
    });
  }
}
