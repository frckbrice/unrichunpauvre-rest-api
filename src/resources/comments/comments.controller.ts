import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CommentaireService } from './comments.service';
import { Commentaire, Prisma } from '@prisma/client';
import { CommentairePaginationParams } from 'src/global/utils/pagination';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentEntity } from './entities/comment.entity';


@Controller('commentaires')
@ApiTags('commentaires')
export class CommentaireController {
  constructor(private readonly commentairesService: CommentaireService) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentEntity })
  create(@Body() createCommentaireDto: Commentaire) {
    return this.commentairesService.createCommentaire(createCommentaireDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity, isArray: true })
  findAll(@Query() params: CommentairePaginationParams) {
    return this.commentairesService.findAllComments(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity, })
  findOne(@Param('id') id: string) {
    return this.commentairesService.findSingleCommentaire({ id });
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentEntity })
  update(@Param('id') id: string, @Body() updateCommentaireDto: Prisma.CommentaireUpdateInput &
  {
    idParent?: string,
    idPub?: string
  }) {
    return this.commentairesService.updateCommentaire({ where: { id }, data: updateCommentaireDto });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity })
  remove(@Param('id') id: string) {
    return this.commentairesService.deleteCommentaire({ id });
  }
}
