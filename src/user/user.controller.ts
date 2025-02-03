import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterOrLoginDto } from './dto/registor-or-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register-or-login')
  registerOrLogin(@Body() registerOrLoginDto: RegisterOrLoginDto) {
    return this.userService.registerOrLogin(registerOrLoginDto);
  }

  @Get()
  findOne(@Request() req) {
    const userId = req.user.userId;
    return this.userService.findOne(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
