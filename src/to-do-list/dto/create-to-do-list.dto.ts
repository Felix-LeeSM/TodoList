import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
export class CreateToDoListDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  category: number;

  @IsOptional()
  @IsDate()
  deadline: Date;
}
