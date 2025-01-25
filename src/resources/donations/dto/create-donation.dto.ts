
import { ApiProperty } from "@nestjs/swagger";

export class CreateDonationDto {
    @ApiProperty()
    montantDons: number;

    @ApiProperty()
    idUser: string;

    @ApiProperty()
    idPub: string;

    @ApiProperty()
    nomDons: string;
}
