import { DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entity/base-entity.entity';
import { UserEntity } from 'src/user/entities/user.entity';

import { CommentEntity } from './comment.entity';

@Entity('comment_like')
export class CommentLikeEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => CommentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: CommentEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
