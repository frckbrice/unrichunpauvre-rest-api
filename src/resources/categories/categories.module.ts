import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryController } from './categories.controller';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoriesModule { }
