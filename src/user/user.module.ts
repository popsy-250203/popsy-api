import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { envVariables } from 'src/common/const/env.config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: envVariables.jwtSecret,
      signOptions: { expiresIn: '90d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
