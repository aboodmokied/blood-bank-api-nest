import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Donor } from 'src/user/donor.model';
import { Donation } from 'src/donation/donation.model';
import { Appointment } from 'src/appointment/appointment.model';
import { Broadcast } from 'src/broadcast/broadcast.model';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';
import { MedicalTest } from 'src/medical-test/medical-test.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      Donor,
      Donation,
      Appointment,
      Broadcast,
      BloodUnit,
      MedicalTest,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
