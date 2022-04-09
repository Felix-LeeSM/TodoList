import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  password: string;
}
