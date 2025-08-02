import { IsInt, Min, IsString, IsIn } from 'class-validator';

export class CreateBloodInventoryDto {
  @IsString()
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
  bloodType: string;

  @IsInt()
  @Min(0)
  quantity: number;
}