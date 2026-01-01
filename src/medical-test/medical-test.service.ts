import { MedicalHistoryService } from 'src/medical-history/medical-history.service';
import { NotificationService } from 'src/notification/notification.service';
import { Donor } from 'src/user/donor.model';
import { MedicalTest, TestResult } from './medical-test.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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

    private readonly medicalHistoryService: MedicalHistoryService,
    private readonly notificationService: NotificationService,
  ) {}

  async runTests(dto: CreateMedicalTestDto) {
    const donation = await this.donationModel.findByPk(dto.donationId, {
      include: [Donor],
    });

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
      
       // Send success notification if donor has email
       if (donation.donor?.email) {
          await this.notificationService.sendMedicalTestResult(donation.donor.email, 'PASSED');
       }

    } else {
      newDonationStatus = 'discarded';
      newUnitStatus = UnitStatus.FAILED;

      // Handle Failed Test
      const conditions: string[] = [];
      if (dto.hiv) conditions.push('HIV');
      if (dto.hepatitis) conditions.push('Hepatitis');
      if (dto.malaria) conditions.push('Malaria');

      const notes = dto.notes 
        ? `Failed medical test. Conditions: ${conditions.join(', ')}. Notes: ${dto.notes}`
        : `Failed medical test. Conditions: ${conditions.join(', ')}`;

      // 1. Update Medical History
      // Create a separate medical history record for each condition
      if (conditions.length > 0) {
        for (const condition of conditions) {
           await this.medicalHistoryService.createMedicalHistory({
            donorId: donation.donorId,
            condition: condition,
            diagnosedAt: new Date(),
            notes: dto.notes,
          });
        }
      } else {
         // Fallback if no specific condition checked but result is failed (should theoretically not happen with form val but good safety)
          await this.medicalHistoryService.createMedicalHistory({
            donorId: donation.donorId,
            condition: 'Unspecified Failure',
            diagnosedAt: new Date(),
            notes: dto.notes,
          });
      }

      // 2. Notify Donor
      if (donation.donor?.email) {
        await this.notificationService.sendMedicalTestResult(donation.donor.email, 'FAILED', conditions);
      }
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
