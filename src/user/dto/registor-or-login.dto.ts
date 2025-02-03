import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export class RegisterOrLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(50)
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider: AuthProvider;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  providerId?: string;
}
