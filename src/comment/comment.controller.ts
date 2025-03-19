import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req): any {
    const userId = req.user.userId;
    return this.commentService.createComment(createCommentDto, userId);
  }

  @Post('/like')
  likeComment(@Body() likeCommentDto: LikeCommentDto, @Request() req) {
    const userId = req.user.userId;
    return this.commentService.likeComment(likeCommentDto, userId);
  }

  @Get(':postId')
  getComments(@Param('postId') postId: string) {
    return this.commentService.getComments(postId);
  }
}
