import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min
} from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsNotEmpty()
  @IsString()
  condition: string;

  @IsNotEmpty()
  @IsString({ each: true })
  allergies: string;

  @IsNotEmpty()

  @IsString({ each: true })
  surgeries: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  donorId: number;
}
