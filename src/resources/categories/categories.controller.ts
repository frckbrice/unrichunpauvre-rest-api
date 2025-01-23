
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { Prisma, Category as CategoryModel } from '@prisma/client';
import { CategoriesPaginationParams } from 'src/global/utils/pagination';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryModel | null> {
    return this.categoryService.findSingleCategory({ id });
  }

  @Get('dreams')
  async getPublishedCategory(
    @Query() params: CategoriesPaginationParams
  ): Promise<CategoryModel[]> {

    return this.categoryService.findAllCategories(params);
  }


  @Post()
  async createlike(
    @Body() categoryData: Prisma.CategoryCreateInput,
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(categoryData);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryData: Prisma.CategoryUpdateInput,
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory({
      where: { id },
      data: categoryData,
    });
  }


  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string): Promise<CategoryModel> {
    const where = { id };
    return this.categoryService.deleteCategory(where);
  }
}
