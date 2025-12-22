import { Injectable, Logger } from '@nestjs/common';
import { StockService } from 'src/stock/stock.service';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/sequelize';
import { Alert } from './alert.model';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    private stockService: StockService,
    private userService: UserService,
    @InjectModel(Alert)
    private alertModel: typeof Alert,
    private notificationService: NotificationService,
  ) {}

  async checkAllHospitalsStock() {
    const hospitals = await this.userService.findAllHospitals();

    for (const hospital of hospitals) {
      await this.checkHospitalStock(hospital.id, hospital.email);
    }
  }

  async checkHospitalStock(hospitalId: number, hospitalEmail?: string) {
    const unitsCounts = await this.stockService.getBloodTypeCounts(hospitalId);
    for (let unitName in unitsCounts) {
      const unitCount = unitsCounts[unitName];
      if (unitCount < 10) {
        await this.createAlert(hospitalId, unitName, unitCount, 10, hospitalEmail);
      }
    }
  }

  async createAlert(
    hospitalId: number,
    bloodType: string,
    currentUnits: number,
    threshold: number,
    hospitalEmail?: string,
  ) {
    try {
      const existing = await this.alertModel.findOne({
        where: {
          hospital_id: hospitalId,
          blood_type: bloodType,
          status: 'NEW',
        },
      });

      if (existing) {
        this.logger.log(
          `Alert already exists for hospital ${hospitalId}, blood type ${bloodType}`,
        );
        return;
      }

      this.logger.log(
        `Creating alert for hospital ${hospitalId}, blood type ${bloodType}, units ${currentUnits}`,
      );

      const alert = await this.alertModel.create({
        hospital_id: hospitalId,
        blood_type: bloodType,
        current_units: currentUnits,
        threshold,
        status: 'NEW',
      });

      if (hospitalEmail) {
        await this.notificationService.sendHospitalAlert(alert, hospitalEmail);
        this.logger.log(`Notification sent to ${hospitalEmail}`);
        await alert.update({ status: 'SENT' }); 
      } else {
        this.logger.warn(`No email found for hospital ${hospitalId}`);
      }
    } catch (error) {
      this.logger.error('Error creating alert', error);
    }
  }
}
