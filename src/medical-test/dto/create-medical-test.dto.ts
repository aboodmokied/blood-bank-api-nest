import { IsEnum, IsInt, IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';
import { TestResult } from '../medical-test.model';

export class CreateMedicalTestDto {
  @IsInt()
  @IsNotEmpty()
  donationId: number;

  @IsBoolean()
  @IsNotEmpty()
  hiv: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hepatitis: boolean;

  @IsBoolean()
  @IsNotEmpty()
  malaria: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(TestResult)
  @IsNotEmpty()
  result: TestResult;
}
