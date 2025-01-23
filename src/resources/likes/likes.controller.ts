
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
import { LikesService } from './likes.service';
import { Prisma, Likes as LikesModel } from '@prisma/client';
import { LikesPaginationParams } from 'src/global/utils/pagination';

@Controller('likes')
export class LikesController {
  constructor(
    private readonly likeservice: LikesService,
  ) { }

  @Get(':id')
  async getLikesById(@Param('id') id: string): Promise<LikesModel | null> {
    return this.likeservice.findSingleLikes({ id });
  }

  @Get('dreams')
  async getPublishedLikes(
    @Query() params: LikesPaginationParams
  ): Promise<LikesModel[]> {

    return this.likeservice.findAllLikes(params);
  }


  @Post()
  async createlike(
    @Body() likesData: Prisma.LikesCreateInput,
  ): Promise<LikesModel> {
    return this.likeservice.createLikes(likesData);
  }

  @Put(':id')
  async updateLikes(
    @Param('id') id: string,
    @Body() likesData: Prisma.LikesUpdateInput,
  ): Promise<LikesModel> {
    return this.likeservice.updateLikes({
      where: { id },
      data: likesData,
    });
  }


  @Delete('likes/:id')
  async deleteLikes(@Param('id') id: string): Promise<LikesModel> {
    const where = { id };
    return this.likeservice.deleteLikes(where);
  }
}
