import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalHistory } from './models/medical-history';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { MedicalHistoryLog } from './models/medical-history-logs';
import { Donor } from 'src/user/donor.model';
import { AuthModule } from 'src/auth/auth.module';
import { MedicalHistoryServiceLogs } from './medical-history-logs.service';


@Module({
  imports: [
    SequelizeModule.forFeature([MedicalHistory, MedicalHistoryLog, Donor]),
    AuthModule 
  ],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService , MedicalHistoryServiceLogs],
  exports: [MedicalHistoryService],
})
export class MedicalHistoryModule {}

