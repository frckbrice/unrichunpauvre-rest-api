import { Prisma } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements Prisma.CategoryCreateInput {
    @ApiProperty()
    createdAt?: string | Date | undefined;
    @ApiProperty()
    id?: string | undefined;
    @ApiProperty()
    nomCat: string;
    @ApiProperty()
    publications?: Prisma.PublicationCreateNestedManyWithoutCategoryInput | undefined;
    @ApiProperty()
    updatedAt?: string | Date | undefined;
    @ApiProperty()
    typeCat?: string | null | undefined;
}
