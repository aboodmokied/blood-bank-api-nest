import { Module } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { MedicalTestController } from './medical-test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalTest } from './medical-test.model';

@Module({
  imports: [SequelizeModule.forFeature([MedicalTest])],
  controllers: [MedicalTestController],
  providers: [MedicalTestService],
})
export class MedicalTestModule {}
