import { ApiProperty } from "@nestjs/swagger";

export class LikeEntity {

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    idPub: string;



    @ApiProperty()
    createdAt?: string | Date | undefined;
    @ApiProperty()
    updatedAt?: string | Date | undefined;
    @ApiProperty()
    id?: string | undefined;

}
