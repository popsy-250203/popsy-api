import { PartialType } from '@nestjs/mapped-types';
import { RegisterOrLoginDto } from './registor-or-login.dto';

export class UpdateUserDto extends PartialType(RegisterOrLoginDto) {}
