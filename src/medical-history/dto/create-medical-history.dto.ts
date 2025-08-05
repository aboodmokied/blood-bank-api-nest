import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsInt()
  @Min(1, { message: 'donorId must be a positive integer' })
  donorId: number;

  @IsString()
  condition: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString(
    {},
    { message: 'diagnosedAt must be a valid ISO date (yyyy-mm-dd)' },
  )
  diagnosedAt: Date;
}
