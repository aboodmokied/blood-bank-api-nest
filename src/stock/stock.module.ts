import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';

@Module({
  imports: [SequelizeModule.forFeature([BloodUnit])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
