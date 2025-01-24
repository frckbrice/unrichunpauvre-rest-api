import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './global/auth/auth.module';
import { CategoriesModule } from './resources/categories/categories.module';
import { UsersModule } from './resources/users/users.module';
import { DonationsModule } from './resources/donations/donations.module';
import { PublicaionsModule } from './resources/publicaions/publications.module';
import { LikesModule } from './resources/likes/likes.module';
import { FavoritesModule } from './resources/favorites/favorites.module';
import { CommentsModule } from './resources/comments/comments.module';
import { PrismaModule } from './global/adapter/adapter.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './global/logger/logger.module';
import { MailModule } from './global/mail/mail.module';
import { ShareModule } from './global/share/share.module';
// import { AuthMiddleware } from './global/auth-security/middleware';
import { JwtAuthGuard } from './global/auth/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    CacheModule.register({
      ttl: 5, // seconds
      // max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'long',
        ttl: 60000,
        limit: 5, //TODO: reduce this and apply correct handling response
      },
      {
        name: 'short',
        limit: 1, // TODO: reduce this and apply correct handling response
        ttl: 1000, // 1 minute
      }
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    CacheModule.register({
      ttl: 5, // seconds
      // max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'long',
        ttl: 60000,
        limit: 5, //TODO: reduce this and apply correct handling response
      },
      {
        name: 'short',
        limit: 1, // TODO: reduce this and apply correct handling response
        ttl: 1000, // 1 minute
      }
    ]),

    AuthModule,
    CategoriesModule,
    UsersModule,
    DonationsModule,
    PublicaionsModule,
    LikesModule,
    FavoritesModule,
    CommentsModule,
    PrismaModule,
    LoggerModule,
    MailModule,
    ShareModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply globally
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor, // caching
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})


export class AppModule { }
