import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalTest, TestResult } from './medical-test.model';
import { Donation, DonationStatus } from 'src/donation/donation.model';
import { BloodUnit, UnitStatus } from 'src/blood-unit/blood-unit.model';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';

@Injectable()
export class MedicalTestService {
  constructor(
    @InjectModel(MedicalTest)
    private readonly testModel: typeof MedicalTest,

    @InjectModel(Donation)
    private readonly donationModel: typeof Donation,

    @InjectModel(BloodUnit)
    private readonly bloodUnitModel: typeof BloodUnit,
  ) {}

  async runTests(dto: CreateMedicalTestDto) {
    const donation = await this.donationModel.findByPk(dto.donationId);

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const test = await this.testModel.create({ ...dto });

    // Determine next status for donation + units
    let newDonationStatus: DonationStatus;
    let newUnitStatus: UnitStatus;

    if (dto.result === TestResult.PASSED) {
      newDonationStatus = 'stored';
      newUnitStatus = UnitStatus.PASSED;
    } else {
      newDonationStatus = 'discarded';
      newUnitStatus = UnitStatus.FAILED;
    }

    // Update donation status
    donation.status = newDonationStatus;
    await donation.save();

    // Update blood units from this donation
    await this.bloodUnitModel.update(
      { status: newUnitStatus },
      { where: { donationId: donation.id } },
    );

    return {
      test,
      donation,
      bloodUnitsUpdated: newUnitStatus,
    };
  }
}
