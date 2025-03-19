import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LikePostDto } from './dto/post-like.dto';
import { UnlikePostDto } from './dto/post-unlike.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interactor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/like')
  @UseInterceptors(TransactionInterceptor)
  likePost(
    @Body() likePostDto: LikePostDto,
    @Request() req,
    @QueryRunner() qr: QR,
  ) {
    return this.postService.likePost(likePostDto, req.user.userId, qr);
  }

  @Post('/unlike')
  @UseInterceptors(TransactionInterceptor)
  unlikePost(
    @Body() unlikePostDto: UnlikePostDto,
    @Request() req,
    @QueryRunner() qr: QR,
  ) {
    return this.postService.unlikePost(unlikePostDto, req.user.userId, qr);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user.userId);
  }

  @Get('/list')
  getPosts(
    @Query('sort') sort?: string,
    @Query('sortKey') sortKey?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('createdAfter') createdAfter?: Date,
  ) {
    return this.postService.getPostList(
      sort,
      sortKey,
      page,
      limit,
      createdAfter,
    );
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(+id);
  }
}
