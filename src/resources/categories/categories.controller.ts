
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
import { ApiAcceptedResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryEntity } from './entities/category.entity';
import { ReturnApiType } from 'src/global/utils/return-type';


@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.findSingleCategory({ id });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  async getPublishedCategory(
    @Query() params: CategoriesPaginationParams
  ) {

    return this.categoryService.findAllCategories(params);
  }


  @Post()
  @ApiBearerAuth()
  @ApiAcceptedResponse({ type: CategoryEntity })
  @ApiCreatedResponse({ type: CategoryEntity })
  async createlike(
    @Body() categoryData: Prisma.CategoryCreateInput,
  ) {
    return this.categoryService.createCategory(categoryData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryData: Prisma.CategoryUpdateInput,
  ): Promise<ReturnApiType<CategoryModel | null>> {
    return this.categoryService.updateCategory({
      where: { id },
      data: categoryData,
    });
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async deleteCategory(@Param('id') id: string): Promise<ReturnApiType<CategoryModel | null>> {
    const where = { id };
    return this.categoryService.deleteCategory(where);
  }
}
