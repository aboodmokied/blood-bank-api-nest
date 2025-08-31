import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donation } from './donation.model';
import { BloodUnitModule } from 'src/blood-unit/blood-unit.module';

@Module({
  imports: [SequelizeModule.forFeature([Donation]), BloodUnitModule],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
