import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
export class CreateToDoListDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'content',
    type: 'string',
    description: '칸반 내용',
  })
  content: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(255)
  @ApiProperty({
    name: 'category',
    type: 'number',
    description: '칸반 카테고리',
  })
  category: number;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    name: 'startsAt',
    type: 'Date',
    description: '시작시간',
  })
  startsAt: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    name: 'deadline',
    type: 'Date',
    description: '칸반 deadline',
  })
  deadline: Date;
}
