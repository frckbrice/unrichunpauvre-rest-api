import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";


export class CommentEntity implements Prisma.CommentaireCreateInput {
    @ApiProperty()
    createdAt?: string | Date | undefined;
    @ApiProperty()
    updatedAt?: string | Date | undefined;
    @ApiProperty()
    etatCom?: boolean | undefined;
    @ApiProperty()
    id?: string | undefined;
    @ApiProperty()
    libeleCom: string;
    @ApiProperty()
    parentComment?: Prisma.CommentaireCreateNestedOneWithoutRepliesInput | undefined;
    @ApiProperty()
    pub: Prisma.PublicationCreateNestedOneWithoutCommentairesInput;
    @ApiProperty()
    replies?: Prisma.CommentaireCreateNestedManyWithoutParentCommentInput | undefined;
    @ApiProperty()
    user: Prisma.UserCreateNestedOneWithoutCommentairesInput;
}
