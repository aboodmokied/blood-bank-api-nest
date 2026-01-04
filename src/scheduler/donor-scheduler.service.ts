import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from 'src/donation/donation.model';
import { NotificationService } from 'src/notification/notification.service';
import { Op } from 'sequelize';
import { Donor } from 'src/user/donor.model';

@Injectable()
export class DonorSchedulerService {
  private readonly logger = new Logger(DonorSchedulerService.name);

  constructor(
    @InjectModel(Donation)
    private readonly donationModel: typeof Donation,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Checking for eligible donors...');

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    
    // We want to find donations that happened EXACTLY 4 months ago to send the reminder once
    const startOfDay = new Date(fourMonthsAgo.setHours(0, 0, 0, 0));
    const endOfDay = new Date(fourMonthsAgo.setHours(23, 59, 59, 999));

    const donations = await this.donationModel.findAll({
      where: {
        donationDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: 'stored', // Or 'stored'? Assuming stored implies valid donation
      },
      include: [Donor],
    });

    for (const donation of donations) {
      if (donation.donor && donation.donor.email) {
        await this.notificationService.sendEligibilityReminder(donation.donor.email);
      }
    }
  }
}
