import { IsInt, IsPositive } from 'class-validator';

export class PatchSequenceDto {
  @IsInt()
  @IsPositive()
  from: number;

  @IsInt()
  @IsPositive()
  to: number;
}
