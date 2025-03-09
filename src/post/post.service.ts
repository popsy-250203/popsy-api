import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner as QR } from 'typeorm';

import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostLikeEntity } from './entities/post-like.entity';
import { LikePostDto } from './dto/post-like.dto';
import { UnlikePostDto } from './dto/post-unlike.dto';

@Injectable()
export class PostService {
  private readonly LIKE_STATUS = {
    LIKED: 1,
    UNLIKED: 0,
  };

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly likeRepository: Repository<PostLikeEntity>,
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
    const [posts, total] = await this.postRepository.findAndCount({
      ...(sort &&
        sortKey && { order: { [sortKey]: sort === 'desc' ? 'DESC' : 'ASC' } }),
      ...(page && limit && { skip: (page - 1) * limit, take: limit }),
      relations: ['creator'],
    });

    return { posts, total };
  }

  async getPost(id: number) {
    const post = await this.findPostById(id);
    return post;
  }

  async likePost(likePostDto: LikePostDto, userId: number, qr: QR) {
    const post = await this.findPostById(likePostDto.postId);
    const like = await this.findLike(post.id, userId);

    if (like) {
      return this.handleExistingLike(like, post, qr);
    }

    return this.createNewLike(post, userId, qr);
  }

  async unlikePost(unlikePostDto: UnlikePostDto, userId: number, qr: QR) {
    const post = await this.findPostById(unlikePostDto.postId);
    const like = await this.findLike(post.id, userId);

    if (like) {
      return this.handleExistingUnlike(like, post, qr);
    }

    return this.createNewUnlike(post, userId, qr);
  }

  private async findPostById(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private async findLike(
    postId: number,
    userId: number,
  ): Promise<PostLikeEntity | null> {
    return this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      withDeleted: true,
    });
  }

  private async handleExistingLike(
    like: PostLikeEntity,
    post: PostEntity,
    qr: QR,
  ) {
    if (like.isLiked === this.LIKE_STATUS.LIKED) {
      like.isLiked = null;
      post.likeCount--;
      await qr.manager.save(like);
      return qr.manager.save(post);
    }

    like.isLiked = this.LIKE_STATUS.LIKED;
    post.likeCount++;
    await qr.manager.save(like);
    return qr.manager.save(post);
  }

  private async createNewLike(post: PostEntity, userId: number, qr: QR) {
    const newLike = qr.manager.create(PostLikeEntity, {
      post: { id: post.id },
      user: { id: userId },
      isLiked: this.LIKE_STATUS.LIKED,
    });

    post.likeCount++;
    await qr.manager.save(newLike);
    return qr.manager.save(post);
  }

  private async handleExistingUnlike(
    like: PostLikeEntity,
    post: PostEntity,
    qr: QR,
  ) {
    if (like.isLiked === this.LIKE_STATUS.UNLIKED) {
      like.isLiked = null;
      post.unlikeCount--;
      await qr.manager.save(like);
      return qr.manager.save(post);
    }

    like.isLiked = this.LIKE_STATUS.UNLIKED;
    post.unlikeCount++;
    await qr.manager.save(like);
    return qr.manager.save(post);
  }

  private async createNewUnlike(post: PostEntity, userId: number, qr: QR) {
    const newLike = qr.manager.create(PostLikeEntity, {
      post: { id: post.id },
      user: { id: userId },
      isLiked: this.LIKE_STATUS.UNLIKED,
    });

    post.unlikeCount++;
    await qr.manager.save(newLike);
    return qr.manager.save(post);
  }
}
