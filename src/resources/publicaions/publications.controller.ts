
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { PublicationService } from './publications.service';
import { Prisma, Publication as PublicationsModel } from '@prisma/client';
import { PublicationPaginationParams } from 'src/global/utils/pagination';

@Controller('publications')
export class PublicaionsController {
  constructor(
    private readonly publicationService: PublicationService,
  ) { }

  @Get(':id')
  async getPublicationsById(@Param('id') id: string): Promise<PublicationsModel | null> {
    return this.publicationService.findSinglePublication({ id });
  }

  @Get('dreams')
  async getPublishedPublications(
    @Query() query: PublicationPaginationParams
  ): Promise<PublicationsModel[]> {

    const { skip, take, cursor, where, orderBy, searchString } = query;
    if (searchString) {
      return this.publicationService.findAllPublications({
        where: {
          OR: [
            {
              libelePub: { contains: searchString },
            },
          ],
        },
      });
    }
    return this.publicationService.findAllPublications({});
  }


  @Post()
  async createPublication(
    @Body() publicationsData: Prisma.PublicationCreateInput,
  ): Promise<PublicationsModel> {
    return this.publicationService.createPublication(publicationsData);
  }

  @Put(':id')
  async updatePublications(
    @Param('id') id: string,
    @Body() publicationsData: Prisma.PublicationUpdateInput,
  ): Promise<PublicationsModel> {
    return this.publicationService.updatePublication({
      where: { id },
      data: publicationsData,
    });
  }


  @Delete('publications/:id')
  async deletePublications(@Param('id') id: string): Promise<PublicationsModel> {
    const where = { id };
    return this.publicationService.deletePublication(where);
  }
}
