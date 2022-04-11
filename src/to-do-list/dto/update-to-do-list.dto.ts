import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class PatchSequenceDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
    description: '이동할 칸반의 id',
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
