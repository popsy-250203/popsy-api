import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user: { id: userId },
    });

    return await this.commentRepository.save(comment);
  }

  async getComments(postId: string) {
    const comments = await this.commentRepository.find({
      where: { post: { id: +postId } },
      relations: ['user', 'parentComment'],
    });

    const rootComments = comments.filter((comment) => !comment.parentComment);
    const childComments = comments.filter((comment) => comment.parentComment);

    const buildHierarchy = (parentComment) => {
      const children = childComments.filter(
        (child) => child.parentComment.id === parentComment.id,
      );

      return {
        ...parentComment,
        children: children.map((child) => buildHierarchy(child)),
      };
    };

    return rootComments.map((rootComment) => buildHierarchy(rootComment));
  }
}
