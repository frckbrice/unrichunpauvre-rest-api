import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class PublicationEntity {

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    category: Prisma.CategoryCreateNestedOneWithoutPublicationsInput;
    @ApiProperty()
    commentaires?: Prisma.CommentaireCreateNestedManyWithoutPubInput | undefined;
    @ApiProperty()
    datePub?: string | Date | undefined;
    @ApiProperty()
    donations?: Prisma.DonationCreateNestedManyWithoutPubInput | undefined;
    @ApiProperty()
    etat?: boolean | undefined;
    @ApiProperty()
    favorites?: Prisma.FavoriteCreateNestedManyWithoutPubInput | undefined;
    @ApiProperty()
    imagePub: string;
    @ApiProperty()
    libelePub: string;
    @ApiProperty()
    likes?: Prisma.LikesCreateNestedManyWithoutPubInput | undefined;
    @ApiProperty()
    montantEstime?: number | undefined;

    @ApiProperty()
    createdAt?: string | Date | undefined;
    @ApiProperty()
    updatedAt?: string | Date | undefined;
    @ApiProperty()
    id?: string | undefined;


}
