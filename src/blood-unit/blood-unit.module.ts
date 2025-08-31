import { Module } from '@nestjs/common';
import { BloodUnitService } from './blood-unit.service';
import { BloodUnitController } from './blood-unit.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BloodUnit } from './blood-unit.model';

@Module({
  imports: [SequelizeModule.forFeature([BloodUnit])],
  controllers: [BloodUnitController],
  providers: [BloodUnitService],
  exports: [BloodUnitService],
})
export class BloodUnitModule {}
