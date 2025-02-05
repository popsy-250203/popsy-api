import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const post = this.postRepository.create({
      ...createPostDto,
      creator: { id: userId },
    });

    return this.postRepository.save(post);
  }

  async getPostList(
    sort?: string,
    sortKey?: string,
    page?: number,
    limit?: number,
  ) {
    const posts = await this.postRepository.find({
      ...(sort &&
        sortKey && { order: { [sortKey]: sort === 'desc' ? 'DESC' : 'ASC' } }),
      ...(page && limit && { skip: (page - 1) * limit, take: limit }),
      relations: ['creator'],
    });

    return posts;
  }

  async getPost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
