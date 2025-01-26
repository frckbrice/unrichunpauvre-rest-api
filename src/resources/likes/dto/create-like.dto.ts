import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLikeDto {

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    idPub: string;


}
