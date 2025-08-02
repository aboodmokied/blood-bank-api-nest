import { IsEnum, IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class CreateBloodRequestDto {
  @IsString()
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Invalid blood type. Allowed types are: A+, A-, B+, B-, AB+, AB-, O+, O-',
  })
  bloodType: string;


  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(['Normal', 'Urgent', 'Emergency'])
  urgency: 'Normal' | 'Urgent' | 'Emergency';

  @IsInt()
  medicalOfficerId: number;

  @IsInt()
  hospitalId: number;

  // @IsInt()
  // @Min(1)
  // receiverId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}