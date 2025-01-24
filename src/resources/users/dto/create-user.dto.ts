import { Exclude } from 'class-transformer';

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty()
    dateNaiss: string | null;
    @ApiProperty()
    etatUser: boolean;
    @ApiProperty()

    localisation: string | null;
    @ApiProperty()
    @Exclude()  // exclude the password from the return object.
    mdpUser: string;
    @ApiProperty()
    nomUser: string;
    @ApiProperty()
    photoUser: string | null;
    @ApiProperty()
    pieceIdb: string | null;
    @ApiProperty()
    pieceIdf: string | null;

    @ApiProperty()
    username: string;
}
