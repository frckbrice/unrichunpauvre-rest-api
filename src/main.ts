import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global/filter/http-exception.filter';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


import 'reflect-metadata';


const PORT = process.env.PORT ?? 5000;
const dev_server_url = `${process.env.LOCAL_API_URL} `;
const production_server_url = `${process.env.PROD_API_URL} `;

const description = 'Une API NestJS conçue pour gérer une plateforme innovante de collecte de dons permettant aux utilisateurs de publier des reves et a d\'assurer la collecte des dons.';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // call the http adapter here
  const { httpAdapter } = app.get(HttpAdapterHost);

  // apply global filters for not handled exceptions
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('unricheunpauvre api')
    .setDescription(description)
    .setVersion('1.0')
    .addTag('unricheunpauvre-api')
    .addBearerAuth()
    .build();

  // We told Express that the public directory will be used for storing static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  const environment = process.env.NODE_ENV || 'development';

  await app.listen(PORT, async () => {
    console.log(
      // `Server running  in ${environment} mode on  ${environment === 'production' ? production_server_url : await app.getUrl()}`,
      `Server running  in ${environment} mode on  ${environment === 'production' ? production_server_url : dev_server_url}`,

    );
  });
}
bootstrap();
