import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { BaseEntity } from 'src/common/entity/base-entity.entity';
import { UserEntity } from 'src/user/entities/user.entity';

import { PostLikeEntity } from './post-like.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Column({ nullable: true })
  @IsUrl()
  imageUrl: string;

  @Column({ default: 0 })
  @IsNumber()
  @IsNotEmpty()
  viewCount: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({ default: 0 })
  @IsNumber()
  @IsNotEmpty()
  likeCount: number;

  @Column({ default: 0 })
  @IsNumber()
  @IsNotEmpty()
  unlikeCount: number;

  @Column({ default: false })
  @IsBoolean()
  isAnonymous: boolean;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  creator: UserEntity;

  @OneToMany(() => PostLikeEntity, (like) => like.post)
  likes: PostLikeEntity[];
}
