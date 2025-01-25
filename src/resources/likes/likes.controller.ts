
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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LikeEntity } from './entities/like.entity';

@Controller('likes')
@ApiTags('likes')
export class LikesController {
  constructor(
    private readonly likeservice: LikesService,
  ) { }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity })
  async getLikesById(@Param('id') id: string) {
    return this.likeservice.findSingleLike({ id });
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity, isArray: true })
  async getPublishedLikes(
    @Query() params: LikesPaginationParams
  ) {

    return this.likeservice.findAllLikes(params);
  }


  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LikeEntity })
  async createlike(
    @Body() likesData: Prisma.LikesCreateInput,
  ) {
    return this.likeservice.createLike(likesData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LikeEntity })
  async updateLikes(
    @Param('id') id: string,
    @Body() likesData: Prisma.LikesUpdateInput,
  ) {
    return this.likeservice.updateLike({
      where: { id },
      data: likesData,
    });
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity })
  async deleteLikes(@Param('id') id: string) {
    const where = { id };
    return this.likeservice.deleteLike(where);
  }
}
