
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Patch,
  HttpStatus,
  HttpException,
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

  @Get('check/:userId/:postId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity })
  async checkLike(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.likeservice.checkLike(userId, postId);
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

  @Delete()
  async deleteLike(@Query('idPub') idPub: string, @Query('idUser') idUser: string) {
    if (!idPub || !idUser) {
      throw new HttpException('Missing required query parameters', HttpStatus.BAD_REQUEST);
    }

    try {
      const deletedLike = await this.likeservice.deletesLike(idPub, idUser);
      if (!deletedLike) {
        throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Like successfully deleted', deletedLike };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
