import { Module } from '@nestjs/common';
import { PublicationService } from './publications.service';
import { PublicaionsController } from './publications.controller';

@Module({
  controllers: [PublicaionsController],
  providers: [PublicationService],
  exports: [PublicationService],
})
export class PublicationModule { }
