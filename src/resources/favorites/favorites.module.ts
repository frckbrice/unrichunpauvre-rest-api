import { Module } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PublicationModule } from '../publicaions/publications.module';

@Module({
  imports: [PublicationModule],
  controllers: [FavoritesController],
  providers: [FavoriteService],
})
export class FavoritesModule { }
