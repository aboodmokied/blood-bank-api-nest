import { TestResult } from '../medical-test.model';

export class CreateMedicalTestDto {
  donationId: number;
  hiv: string;
  hepatitis: string;
  malaria: string;
  result: TestResult;
}
