import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PatchContentDto {
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  @ApiProperty({
    example: '이력서 쓰기',
    description: '수정할 칸반의 내용',
  })
  content: string;
}

export class PatchDeadlineDto {
  @IsDate()
  @ApiProperty({
    example: new Date(),
    description: '수정할 deadline',
  })
  deadline: Date;
}

export class PatchCompleteDto {
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: '수정될 칸반의 완료 ',
  })
  isComplete: boolean;
}

export class PatchSequenceDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
    description: '수정할 칸반의 id',
  })
  from: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 2,
    description: '해당하는 위치에 존재하던 칸반의 id',
  })
  to: number;
}
