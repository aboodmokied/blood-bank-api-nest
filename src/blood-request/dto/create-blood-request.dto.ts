import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBloodRequestDto {
  @IsInt()
  fromHospitalId: number;

  @IsInt()
  toHospitalId: number;

  @IsString()
  @IsNotEmpty()
  bloodType: string;

  @IsInt()
  qty: number;

  @IsInt()
  urgencyLevel: number;
}
