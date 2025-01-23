import { Prisma } from "@prisma/client";

export class CategoriesPaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
}

export class PublicationPaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.PublicationWhereUniqueInput;
    where?: Prisma.PublicationWhereInput;
    orderBy?: Prisma.PublicationOrderByWithRelationInput;
    searchString?: string;
}

export class UserPaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
}

export class CommentairePaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentaireWhereUniqueInput;
    where?: Prisma.CommentaireWhereInput;
    orderBy?: Prisma.CommentaireOrderByWithRelationInput;
}

export class FavoritePaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.FavoriteWhereUniqueInput;
    where?: Prisma.FavoriteWhereInput;
    orderBy?: Prisma.FavoriteOrderByWithRelationInput;
}

export class LikesPaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.LikesWhereUniqueInput;
    where?: Prisma.LikesWhereInput;
    orderBy?: Prisma.LikesOrderByWithRelationInput;
}

export class DonationPaginationParams {
    skip?: number;
    take?: number;
    cursor?: Prisma.DonationWhereUniqueInput;
    where?: Prisma.DonationWhereInput;
    orderBy?: Prisma.DonationOrderByWithRelationInput;
}

