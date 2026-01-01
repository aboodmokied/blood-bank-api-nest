import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation, DonationStatus } from './donation.model';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { BloodUnitService } from 'src/blood-unit/blood-unit.service';
import { UnitStatus } from 'src/blood-unit/blood-unit.model';

import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation)
    private donationModel: typeof Donation,
    private bloodUnitService: BloodUnitService,
    private appointmentService: AppointmentService,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const donation = await this.donationModel.create({
      ...createDonationDto,
    });

    await this.bloodUnitService.create({
      bloodType: donation.bloodType,
      donationId: donation.id,
      hospitalId: createDonationDto.hospitalId,
      collectedAt: new Date().toISOString(),
      status: UnitStatus.PENDING,
    });

    if (createDonationDto.appointmentId) {
      await this.appointmentService.changeStatus(
        createDonationDto.appointmentId,
        'completed',
      );
    }

    return { donation, message: 'donation created successfully' };
  }

  async findAll(page = 1, limit = 10, status?: DonationStatus) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    const { data: donations, pagination } =
      await this.donationModel.findWithPagination(page, limit, { where });
    return { donations, pagination };
  }

  async findOne(id: number) {
    const donation = await this.donationModel.findByPk(id);
    if (!donation) {
      throw new NotFoundException('donation not found');
    }
    return { donation };
  }

  async findByDonor(donorId: number, page = 1, limit = 10) {
    const { data: donations, pagination } =
      await this.donationModel.findWithPagination(page, limit, {
        where: { donorId },
      });

    return { donations, pagination };
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    const donation = await this.donationModel.findByPk(id);
    if (!donation) {
      throw new NotFoundException('donation not found');
    }
    await donation.update({ ...updateDonationDto });
    return { message: 'donation updated successfully', donation };
  }

  async remove(id: number) {
    await this.donationModel.destroy({ where: { id } });
    return { message: 'donation deleted successfully' };
  }

  async changeStatus(id: number, newStatus: DonationStatus) {
    const donation = await this.donationModel.findByPk(id);
    if (!donation) {
      throw new NotFoundException('donation not found');
    }

    const allowedStatuses: DonationStatus[] = [
      'collected',
      'stored',
      'discarded',
    ];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException('Invalid status');
    }

    donation.status = newStatus;
    await donation.save();

    return donation;
  }
}
