import { Module } from '@nestjs/common';
import { CommentaireService } from './comments.service';
import { CommentaireController } from './comments.controller';

@Module({
  controllers: [CommentaireController],
  providers: [CommentaireService],
})
export class CommentsModule { }
