import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFavoriteDto {

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    idPub: string;

}
