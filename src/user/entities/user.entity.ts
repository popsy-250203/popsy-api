import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entity/base-entity.entity';

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
}
