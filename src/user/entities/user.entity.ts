import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { PostEntity } from 'src/post/entities/post.entity';

import { BaseEntity } from '../../common/entity/base-entity.entity';
import { PostLikeEntity } from 'src/post/entities/post-like.entity';

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  provider: AuthProvider;

  @Column({ type: 'varchar', nullable: true, unique: true })
  providerId?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @OneToMany(() => PostEntity, (post) => post.creator)
  posts: PostEntity[];

  @OneToMany(() => PostLikeEntity, (like) => like.user)
  likes: PostLikeEntity[];
}
