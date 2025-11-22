import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertService } from './alert.service';
import { AlertCron } from './alert.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [AlertService, AlertCron],
})
export class AlertModule {}
