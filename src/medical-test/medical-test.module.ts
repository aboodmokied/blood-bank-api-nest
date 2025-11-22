import { Module } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { MedicalTestController } from './medical-test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalTest } from './medical-test.model';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';
import { Donation } from 'src/donation/donation.model';

@Module({
  imports: [SequelizeModule.forFeature([MedicalTest, BloodUnit, Donation])],
  controllers: [MedicalTestController],
  providers: [MedicalTestService],
})
export class MedicalTestModule {}
