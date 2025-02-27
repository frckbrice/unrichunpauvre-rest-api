
import {
  Controller,
  Get,
  Param,
  Post,
  Body,

  Delete,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { PublicationService } from './publications.service';
import { Prisma, Publication, Publication as PublicationsModel } from '@prisma/client';
import { PublicationPaginationParams } from 'src/global/utils/pagination';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicationEntity } from './entities/publicaion.entity';
import { SkipThrottle } from '@nestjs/throttler';


@SkipThrottle()
@Controller('publications')
@ApiTags('publications')

export class PublicaionsController {
  constructor(
    private readonly publicationService: PublicationService,
  ) { }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PublicationEntity })
  async getPublicationsById(@Param('id') id: string) {
    return this.publicationService.findSinglePublication({ id });
  }

  @SkipThrottle({ default: false })
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PublicationEntity, isArray: true })
  async getPublishedPublications(
    @Query() query: PublicationPaginationParams
  ) {

    return this.publicationService.findAllPublications(query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PublicationEntity })
  async createPublication(
    @Body() publicationsData: Publication,
  ) {
    return this.publicationService.createPublication(publicationsData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PublicationEntity })
  async updatePublications(
    @Param('id') id: string,
    @Body() publicationsData: Prisma.PublicationUpdateInput,
  ) {
    return this.publicationService.updatePublication({
      where: { id },
      data: publicationsData,
    });
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PublicationEntity })
  async deletePublications(@Param('id') id: string) {
    const where = { id };
    return this.publicationService.deletePublication(where);
  }
}
