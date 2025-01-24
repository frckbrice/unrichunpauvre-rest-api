import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLikeDto {

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
    @ApiProperty()
    pub: Prisma.PublicationCreateNestedOneWithoutDonationsInput;
    @ApiProperty()
    user: Prisma.UserCreateNestedOneWithoutDonationsInput;
}
