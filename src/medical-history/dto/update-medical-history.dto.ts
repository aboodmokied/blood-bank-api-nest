import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateMedicalHistoryDto {
  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'diagnosedAt must be a valid ISO date (yyyy-mm-dd)' },
  )
  diagnosedAt?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  donorId?: number; // optional, in case you want to allow changing ownership
}
