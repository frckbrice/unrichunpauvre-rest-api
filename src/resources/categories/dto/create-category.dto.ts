import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {

    @ApiProperty()
    nomCat: string;

    @ApiProperty()
    typeCat?: string | null | undefined;
}
