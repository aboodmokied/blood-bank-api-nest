import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AlertService } from './alert.service';

@Injectable()
export class AlertCron {
  private readonly logger = new Logger(AlertCron.name);

  constructor(private alertService: AlertService) {}

  // Run every hour
  //   @Cron('0 * * * *')
  // Run every 10 sec
  // @Cron('*/10 * * * * *')
  // async handleCron() {
  //   this.logger.log('Checking blood stock levels...');
  //   console.log('hello from cron');
  //   await this.alertService.checkAllHospitalsStock();
  // }
}
