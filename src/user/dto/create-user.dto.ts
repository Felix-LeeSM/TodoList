import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    example: 'asdf',
    description: '유저 id',
  })
  id: string;

  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    example: 'asdf',
    description: '유저 password',
  })
  password: string;

  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    example: 'asdf',
    description: '유저 confirmPassword',
  })
  confirmPassword: string;
}
