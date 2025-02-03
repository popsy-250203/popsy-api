import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterOrLoginDto } from './dto/registor-or-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async findUserByProviderId(providerId: string) {
    return await this.userRepository.findOne({ where: { providerId } });
  }

  private async updateLastLoginAt(userId: number) {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  private async login(loginDto: RegisterOrLoginDto) {
    if (loginDto.provider === AuthProvider.EMAIL) {
      const user = await this.findUserByEmail(loginDto.email);
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      await this.updateLastLoginAt(user.id);

      const payload = {
        userId: user.id,
        email: user.email,
      };

      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    }

    const user = await this.findUserByProviderId(loginDto.providerId);
    if (!user) {
      throw new BadRequestException('Invalid providerId');
    }

    await this.updateLastLoginAt(user.id);

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async registerOrLogin(registerOrLoginDto: RegisterOrLoginDto) {
    const user = await this.findUserByEmail(registerOrLoginDto.email);
    if (user && user.id) {
      return this.login(registerOrLoginDto);
    }

    const hashedPassword = await bcrypt.hash(registerOrLoginDto.password, 10);
    const newUser = await this.userRepository.create({
      ...registerOrLoginDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    const payload = {
      userId: newUser.id,
      email: newUser.email,
    };

    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
