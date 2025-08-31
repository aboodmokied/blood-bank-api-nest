import { UnitStatus } from '../blood-unit.model';

export class CreateBloodUnitDto {
  donationId: number;

  bloodType: string;

  status?: UnitStatus;

  collectedAt?: string;
}
