import { Module } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
  controllers: [FavoritesController],
  providers: [FavoriteService],
})
export class FavoritesModule { }
