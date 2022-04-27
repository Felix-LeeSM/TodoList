import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    example: 'asdf',
    description: '유저 id',
  })
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    example: 'asdf',
    description: '유저 password',
  })
  password: string;
}
