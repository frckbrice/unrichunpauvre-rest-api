import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Prisma } from '@prisma/client';
import { FavoritePaginationParams } from 'src/global/utils/pagination';


@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoriteService) { }

  @Post()
  create(@Body() createFavoriteDto: Prisma.FavoriteCreateInput) {
    return this.favoritesService.createFavorite(createFavoriteDto);
  }

  @Get()
  findAll(@Query() params: FavoritePaginationParams) {
    return this.favoritesService.findAllFavorites(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findSingleFavorite({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteDto: Prisma.FavoriteUpdateInput) {
    return this.favoritesService.updateFavorite({ where: { id }, data: updateFavoriteDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.deleteFavorite({ id });
  }
}
