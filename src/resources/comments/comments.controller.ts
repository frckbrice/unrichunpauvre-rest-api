import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentaireService } from './comments.service';
import { Commentaire, Prisma } from '@prisma/client';
import { CommentairePaginationParams } from 'src/global/utils/pagination';


@Controller('commentaires')
export class CommentaireController {
  constructor(private readonly commentairesService: CommentaireService) { }

  @Post()
  create(@Body() createCommentaireDto: Prisma.CommentaireCreateInput) {
    return this.commentairesService.createCommentaire(createCommentaireDto);
  }

  @Get()
  findAll(@Query() params: CommentairePaginationParams) {
    return this.commentairesService.findAllCommentaires(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentairesService.findSingleCommentaire({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentaireDto: Prisma.CommentaireUpdateInput) {
    return this.commentairesService.updateCommentaire({ where: { id }, data: updateCommentaireDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentairesService.deleteCommentaire({ id });
  }
}
