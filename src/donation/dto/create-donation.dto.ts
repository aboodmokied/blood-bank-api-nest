import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateDonationDto {
  @IsInt()
  @IsNotEmpty()
  donorId: number;

  @IsInt()
  @IsNotEmpty()
  hospitalId: number;

  @IsInt()
  @IsOptional()
  appointmentId?: number;

  @IsDateString()
  @IsOptional()
  donationDate?: string; // defaults to now if not provided

  @IsString()
  @IsNotEmpty()
  bloodType: string; // e.g., "A+", "O-"

  @IsInt()
  @Min(1)
  volume: number; // ml

  @IsString()
  @IsIn(['collected', 'stored', 'discarded'])
  @IsOptional()
  status?: 'collected' | 'tested' | 'stored' | 'discarded';
}
