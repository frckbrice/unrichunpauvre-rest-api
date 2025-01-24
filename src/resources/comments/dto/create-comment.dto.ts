import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    etatCom?: boolean | undefined;
    @ApiProperty()
    libeleCom: string;

    @ApiProperty()
    idParent?: string;

    @ApiProperty()
    idPub: string;

    @ApiProperty()
    idUser: string;

}
