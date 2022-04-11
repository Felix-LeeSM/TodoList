import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'asdf',
    description: '유저 id',
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: 'asdf',
    description: '유저 password',
  })
  password: string;
}
