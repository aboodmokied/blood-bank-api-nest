import { Module } from '@nestjs/common';
import { DonorSchedulerService } from './donor-scheduler.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donation } from 'src/donation/donation.model';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Donation]),
    NotificationModule
  ],
  providers: [DonorSchedulerService],
})
export class SchedulerModule {}
