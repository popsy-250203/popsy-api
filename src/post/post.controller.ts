import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    console.log(req.user);
    return this.postService.createPost(createPostDto, req.user.userId);
  }

  @Get('/list')
  getPosts(
    @Query('sort') sort?: string,
    @Query('sortKey') sortKey?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.getPostList(sort, sortKey, page, limit);
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(+id);
  }
}
