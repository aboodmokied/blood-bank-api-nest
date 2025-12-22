import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertService } from './alert.service';
import { AlertCron } from './alert.cron';
import { UserModule } from 'src/user/user.module';
import { BloodUnitModule } from 'src/blood-unit/blood-unit.module';
import { StockModule } from 'src/stock/stock.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Alert } from './alert.model';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    StockModule,
    SequelizeModule.forFeature([Alert]),
    NotificationModule,
  ],
  providers: [AlertService, AlertCron],
})
export class AlertModule {}
