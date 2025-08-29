import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsIn,
} from 'class-validator';
import { AppointmentStatus } from '../appointment.model';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  hospitalId: number;

  @IsInt()
  @IsNotEmpty()
  donorId: number;

  @IsDateString()
  @IsNotEmpty()
  date: string; // e.g., "2025-09-01T10:00:00Z"

  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed', 'missed'])
  @IsNotEmpty()
  status: AppointmentStatus;
}
