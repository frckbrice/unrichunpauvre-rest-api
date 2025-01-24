import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global/filter/http-exception.filter';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

import 'reflect-metadata';


const PORT = process.env.PORT ?? 5000;
const dev_server_url = `${process.env.LOCAL_API_URL} `;
const production_server_url = `${process.env.PROD_API_URL} `;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // call the http adapter here
  const { httpAdapter } = app.get(HttpAdapterHost);

  // apply global filters for not handled exceptions
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('unricheunpauvre api')
    .setDescription('unricheunpauvre api documentation')
    .setVersion('1.0')
    .addTag('unricheunpauvre-api')
    .addBearerAuth()
    .build();


  // override operationIdFactory to make it unique per method
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    // useGlobalPrefix: true,
    yamlDocumentUrl: 'swagger/yaml',
  });


  const environment = process.env.NODE_ENV || 'development';

  await app.listen(PORT, async () => {
    console.log(
      // `Server running  in ${environment} mode on  ${environment === 'production' ? production_server_url : await app.getUrl()}`,
      `Server running  in ${environment} mode on  ${environment === 'production' ? production_server_url : dev_server_url}`,

    );
  });
}
bootstrap();
