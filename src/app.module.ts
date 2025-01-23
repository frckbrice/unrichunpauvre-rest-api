import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { CategoriesModule } from './resources/categories/categories.module';
import { UsersModule } from './resources/users/users.module';
import { DonationsModule } from './resources/donations/donations.module';
import { PublicaionsModule } from './resources/publicaions/publications.module';
import { LikesModule } from './resources/likes/likes.module';
import { FavoritesModule } from './resources/favorites/favorites.module';
import { CommentsModule } from './resources/comments/comments.module';
import { PrismaModule } from './global/adapter/adapter.module';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    UsersModule,
    DonationsModule,
    PublicaionsModule,
    LikesModule,
    FavoritesModule,
    CommentsModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
