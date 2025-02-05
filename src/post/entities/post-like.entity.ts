import { Column, DeleteDateColumn, Entity, ManyToOne, Unique } from 'typeorm';
import { IsDate, IsEnum, IsInt } from 'class-validator';

import { BaseEntity } from 'src/common/entity/base-entity.entity';
import { UserEntity } from 'src/user/entities/user.entity';

import { PostEntity } from './post.entity';

enum LikeStatus {
  DISLIKE = 0,
  LIKE = 1,
}

@Entity('post_like')
@Unique(['post', 'user'])
export class PostLikeEntity extends BaseEntity {
  @Column({ default: LikeStatus.DISLIKE, nullable: true })
  @IsEnum(LikeStatus)
  @IsInt()
  isLiked: LikeStatus;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  user: UserEntity;

  @DeleteDateColumn({ nullable: true })
  @IsDate()
  deletedAt: Date;
}
