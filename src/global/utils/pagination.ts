import { Prisma } from "@prisma/client";

export class CategoriesPaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
}

export class PublicationPaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.PublicationWhereUniqueInput;
    where?: Prisma.PublicationWhereInput;
    orderBy?: Prisma.PublicationOrderByWithRelationInput;
    searchString?: string;
    etat?: boolean;
    idUser?: string;
    idCat?: string;
}

export class UserPaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
}

export class CommentairePaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.CommentaireWhereUniqueInput;
    where?: Prisma.CommentaireWhereInput;
    orderBy?: Prisma.CommentaireOrderByWithRelationInput;
    idPub?: string;
    idUser?: string;
}

export class FavoritePaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.FavoriteWhereUniqueInput;
    where?: Prisma.FavoriteWhereInput;
    orderBy?: Prisma.FavoriteOrderByWithRelationInput;
    idPub?: string;
    idUser?: string;
}

export class LikesPaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.LikesWhereUniqueInput;
    where?: Prisma.LikesWhereInput;
    orderBy?: Prisma.LikesOrderByWithRelationInput;
    idPub?: string;
    idUser?: string;
}

export class DonationPaginationParams {
    page?: number;
    perPage?: number;
    cursor?: Prisma.DonationWhereUniqueInput;
    where?: Prisma.DonationWhereInput;
    orderBy?: Prisma.DonationOrderByWithRelationInput;
    idPub?: string;
    idUser?: string;
}

