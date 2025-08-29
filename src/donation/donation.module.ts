import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donation } from './donation.model';

@Module({
  imports: [SequelizeModule.forFeature([Donation])],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
