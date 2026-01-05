import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donation } from './donation.model';
import { Donor } from 'src/user/donor.model';
import { BloodUnitModule } from 'src/blood-unit/blood-unit.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [SequelizeModule.forFeature([Donation, Donor]), BloodUnitModule, AppointmentModule],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
