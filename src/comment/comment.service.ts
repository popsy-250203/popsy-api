import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { CommentLikeEntity } from './entities/comment-like.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(CommentLikeEntity)
    private readonly likeRepository: Repository<CommentLikeEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user: { id: userId },
      post: { id: createCommentDto.postId },
      parentComment: createCommentDto.parentCommentId
        ? { id: createCommentDto.parentCommentId }
        : undefined,
    });

    return await this.commentRepository.save(comment);
  }

  async getComments(postId: string) {
    const comments = await this.commentRepository.find({
      where: { post: { id: +postId } },
      relations: ['user', 'parentComment', 'likes', 'likes.user'],
    });

    const rootComments = comments.filter((comment) => !comment.parentComment);
    const childComments = comments.filter((comment) => comment.parentComment);

    const buildHierarchy = ({ likes, ...parentComment }) => {
      const children = childComments.filter(
        (child) => child.parentComment.id === parentComment.id,
      );
      const transformedLikes = likes.map((like) => ({
        ...like,
        userId: like.user.id,
        user: undefined,
      }));

      return {
        ...parentComment,
        likeCount: likes.length,
        likes: transformedLikes,
        children: children.map((child) => buildHierarchy(child)),
      };
    };

    return rootComments.map((rootComment) => buildHierarchy(rootComment));
  }

  async likeComment(likeCommentDto: LikeCommentDto, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: likeCommentDto.commentId },
    });

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    const like = await this.likeRepository.findOne({
      where: {
        comment: { id: likeCommentDto.commentId },
        user: { id: userId },
      },
    });

    if (like) {
      await this.likeRepository.softDelete(like.id);
      return { message: '좋아요 취소' };
    }

    const createdLike = this.likeRepository.create({
      comment: { id: likeCommentDto.commentId },
      user: { id: userId },
    });

    await this.likeRepository.save(createdLike);

    return { message: '좋아요 추가' };
  }
}
