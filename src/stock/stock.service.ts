import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BloodUnit, UnitStatus } from 'src/blood-unit/blood-unit.model';
import { Donation } from 'src/donation/donation.model';
import { MedicalTest } from 'src/medical-test/medical-test.model';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(BloodUnit)
    private readonly bloodUnitModel: typeof BloodUnit,
  ) {}

  // All units belonging to a given hospital
  async getHospitalStock(hospitalId: number) {
    return this.bloodUnitModel.findAll({
      include: [
        {
          model: Donation,
          where: { hospitalId },
        },
        {
          model: MedicalTest,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Filter by blood type
  async getByType(hospitalId: number, bloodType: string) {
    return this.bloodUnitModel.findAll({
      where: { bloodType },
      include: [
        {
          model: Donation,
          where: { hospitalId },
        },
        {
          model: MedicalTest,
        },
      ],
    });
  }

  // Filter by status
  async getByStatus(hospitalId: number, status: UnitStatus) {
    if (!Object.values(UnitStatus).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.bloodUnitModel.findAll({
      where: { status },
      include: [
        {
          model: Donation,
          where: { hospitalId },
        },
        {
          model: MedicalTest,
        },
      ],
    });
  }

  // Get details of single unit
  async getUnit(id: number) {
    const unit = await this.bloodUnitModel.findByPk(id, {
      include: [Donation, MedicalTest],
    });

    if (!unit) throw new NotFoundException('Blood Unit not found');
    return unit;
  }

  // Update status (PASSED, FAILED, PENDING)
  async updateUnitStatus(id: number, status: UnitStatus) {
    if (!Object.values(UnitStatus).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const unit = await this.bloodUnitModel.findByPk(id);
    if (!unit) throw new NotFoundException('Blood Unit not found');

    unit.status = status;
    await unit.save();
    return unit;
  }
}
