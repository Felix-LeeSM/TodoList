import { LoginDto } from './dto/login.dto';
import { authGuard } from './../auth/auth.guard';
import {
  Controller,
  Post,
  Body,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(authGuard)
  @Delete()
  remove(@Req() req) {
    const id: string = req.user;
    return this.userService.remove(id);
  }
}
