import { Exclude } from 'class-transformer';
import { Prisma, User } from '@prisma/client';
import { ApiProperty } from "@nestjs/swagger";


export class UserEntity {
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    dateCrea?: Date;
    @ApiProperty()
    dateNaiss?: string | null;
    @ApiProperty()
    etatUser: boolean;
    @ApiProperty()
    id?: string;
    @ApiProperty()
    localisation?: string | null;

    @Exclude()  // exclude the password from the return object.
    mdpUser: string;
    @ApiProperty()
    nomUser: string;
    @ApiProperty()
    photoUser?: string | null;
    @ApiProperty()
    pieceIdb?: string | null;
    @ApiProperty()
    pieceIdf?: string | null;
    @ApiProperty()
    updatedAt?: Date;
    @ApiProperty()
    username: string;
}
