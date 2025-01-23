
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/adapter/prisma-service';
import { Commentaire, Prisma } from '@prisma/client';
import { CommentairePaginationParams } from 'src/global/utils/pagination';

@Injectable()
export class CommentaireService {
  constructor(private prismaService: PrismaService) { }

  async findSingleCommentaire(
    puCommentaireWhereUniqueInput: Prisma.CommentaireWhereUniqueInput,
  ): Promise<Commentaire | null> {
    return this.prismaService.commentaire.findUnique({
      where: puCommentaireWhereUniqueInput,
    });
  }

  async findAllCommentaires(params: CommentairePaginationParams): Promise<Commentaire[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.commentaire.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCommentaire(data: Prisma.CommentaireCreateInput): Promise<Commentaire> {
    return this.prismaService.commentaire.create({
      data,
    });
  }

  async updateCommentaire(params: {
    where: Prisma.CommentaireWhereUniqueInput;
    data: Prisma.CommentaireUpdateInput;
  }): Promise<Commentaire> {
    const { where, data } = params;
    return this.prismaService.commentaire.update({
      data,
      where,
    });
  }

  async deleteCommentaire(where: Prisma.CommentaireWhereUniqueInput): Promise<Commentaire> {
    return this.prismaService.commentaire.delete({
      where,
    });
  }
}
