import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner as QR, MoreThanOrEqual } from 'typeorm';

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
    createdAfter?: Date | undefined,
    category?: string,
  ) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        ...(createdAfter && {
          createdAt: MoreThanOrEqual(createdAfter),
        }),
        ...(category && { category }),
      },
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

  private async findPostById(
    id: number,
  ): Promise<PostEntity & { likeCount: number }> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['creator', 'likes', 'likes.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const transformedLikes = post.likes.map((like) => ({
      ...like,
      userId: like.user.id,
      user: undefined,
    }));

    const likeCount = post.likes.filter(
      (like) => like.isLiked === this.LIKE_STATUS.LIKED,
    ).length;
    const unlikeCount = post.likes.filter(
      (like) => like.isLiked === this.LIKE_STATUS.UNLIKED,
    ).length;

    return {
      ...post,
      likeCount,
      unlikeCount,
      likes: transformedLikes,
    };
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
      await qr.manager.save(PostLikeEntity, like);
      return qr.manager.save(PostEntity, post);
    }

    like.isLiked = this.LIKE_STATUS.LIKED;
    post.likeCount++;
    await qr.manager.save(PostLikeEntity, like);
    return qr.manager.save(PostEntity, post);
  }

  private async createNewLike(post: PostEntity, userId: number, qr: QR) {
    await qr.manager.update(PostEntity, post.id, {
      likeCount: post.likeCount + 1,
    });
    return qr.manager.save(PostLikeEntity, {
      post: { id: post.id },
      user: { id: userId },
      isLiked: this.LIKE_STATUS.LIKED,
    });
  }

  private async handleExistingUnlike(
    like: PostLikeEntity,
    post: PostEntity,
    qr: QR,
  ) {
    if (like.isLiked === this.LIKE_STATUS.UNLIKED) {
      like.isLiked = null;
      await qr.manager.save(PostLikeEntity, like);
      return qr.manager.save(PostEntity, {
        ...post,
        unlikeCount: post.unlikeCount - 1,
      });
    }

    like.isLiked = this.LIKE_STATUS.UNLIKED;
    await qr.manager.save(PostLikeEntity, like);
    return qr.manager.save(PostEntity, {
      ...post,
      likeCount: post.likeCount - 1,
      unlikeCount: post.unlikeCount + 1,
    });
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
