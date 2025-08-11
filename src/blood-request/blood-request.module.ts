import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BloodRequest } from './blood-request.model';
import { BloodRequestService } from './blood-request.service';
import { BloodRequestController } from './blood-request.controller';

@Module({
  imports: [SequelizeModule.forFeature([BloodRequest])],
  controllers: [BloodRequestController],
  providers: [BloodRequestService],
})
export class BloodRequestModule {}
