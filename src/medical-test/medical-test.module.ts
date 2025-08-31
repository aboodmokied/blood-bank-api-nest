import { Module } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { MedicalTestController } from './medical-test.controller';

@Module({
  controllers: [MedicalTestController],
  providers: [MedicalTestService],
})
export class MedicalTestModule {}
