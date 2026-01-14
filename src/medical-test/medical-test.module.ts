import { Module } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { MedicalTestController } from './medical-test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalTest } from './medical-test.model';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';
import { Donation } from 'src/donation/donation.model';
import { Donor } from 'src/user/donor.model';
import { MedicalHistoryModule } from 'src/medical-history/medical-history.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MedicalTest, BloodUnit, Donation, Donor]),
    MedicalHistoryModule,
    NotificationModule,
  ],
  controllers: [MedicalTestController],
  providers: [MedicalTestService],
})
export class MedicalTestModule {}
