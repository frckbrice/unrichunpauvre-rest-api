import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, HttpException, HttpStatus } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Prisma } from '@prisma/client';
import { FavoritePaginationParams } from 'src/global/utils/pagination';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FavoriteEntity } from './entities/favorite.entity';


@Controller('favorites')
@ApiTags('favoris')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoriteService) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FavoriteEntity })
  create(@Body() createFavoriteDto: Prisma.FavoriteCreateInput) {
    return this.favoritesService.createFavorite(createFavoriteDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: FavoriteEntity })
  findAll(@Query() params: FavoritePaginationParams) {
    return this.favoritesService.findAllFavorites(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FavoriteEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.favoritesService.findSingleFavorite({ id });
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FavoriteEntity })
  update(@Param('id') id: string, @Body() updateFavoriteDto: Prisma.FavoriteUpdateInput) {
    return this.favoritesService.updateFavorite({ where: { id }, data: updateFavoriteDto });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FavoriteEntity })
  remove(@Param('id') id: string) {
    return this.favoritesService.deleteFavorite({ id });
  }

  @Delete()
  async deleteLike(@Query('idPub') idPub: string, @Query('idUser') idUser: string) {
    if (!idPub || !idUser) {
      throw new HttpException('Missing required query parameters', HttpStatus.BAD_REQUEST);
    }

    try {
      const deletedLike = await this.favoritesService.deletesfavorite(idPub, idUser);
      if (!deletedLike) {
        throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Like successfully deleted', deletedLike };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
