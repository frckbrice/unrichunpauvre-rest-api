import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";


export class CommentEntity {
    @ApiProperty()
    createdAt?: string | Date | undefined;
    @ApiProperty()
    updatedAt?: string | Date | undefined;
    @ApiProperty()
    etatCom?: boolean | undefined;
    @ApiProperty()
    id?: string | undefined;

    @ApiProperty()
    idParent?: string | undefined;
    @ApiProperty()
    libeleCom: string;

    @ApiProperty()
    isReplied?: boolean | undefined;
    @ApiProperty()
    replies?: Prisma.CommentaireCreateNestedManyWithoutParentCommentInput | undefined;
    idUser: string;
    idPub: string;
}
