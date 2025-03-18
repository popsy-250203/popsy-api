import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from 'src/common/entity/base-entity.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: CommentEntity | null;
}
