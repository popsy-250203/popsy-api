import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostLikeEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
