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
import { ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiTags('User APIs')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '회원 가입' })
  register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(authGuard)
  @Delete()
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiHeader({
    name: 'authorization',
    description: 'accessToken',
  })
  withdrawal(@Req() req) {
    const id: string = req.user;
    return this.userService.withdrawal(id);
  }
}
