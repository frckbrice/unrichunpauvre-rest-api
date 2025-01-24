import { ApiProperty } from "@nestjs/swagger";

export class CreatePublicaionDto {

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    idPub: string;

    @ApiProperty()
    datePub?: string | Date | undefined;

    @ApiProperty()
    etat?: boolean | undefined;

    @ApiProperty()
    imagePub: string;
    @ApiProperty()
    libelePub: string;


}
