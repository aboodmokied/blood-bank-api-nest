import { UnitStatus } from '../blood-unit.model';

export class CreateBloodUnitDto {
  donationId: number;

  hospitalId: number;

  bloodType: string;

  status?: UnitStatus;

  collectedAt?: string;
}
