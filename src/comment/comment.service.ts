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
}
