import { Column, Entity } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseEntity } from 'src/common/entity/base-entity.entity';

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
}
