import { Injectable } from '@nestjs/common';
import { StockService } from 'src/stock/stock.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AlertService {
  constructor(
    private stockService: StockService,
    private userService: UserService,
  ) {}

  async checkAllHospitalsStock() {
    const hospitals = await this.userService.findAllHospitals();

    for (const hospital of hospitals) {
      await this.checkHospitalStock(hospital.id);
    }
  }

  async checkHospitalStock(hospitalId: number) {
    const unitsCounts = await this.stockService.getBloodTypeCounts(hospitalId);
    for (let unitName in unitsCounts) {
      const unitCount = unitsCounts[unitName];
      if (unitCount < 10) {
        await this.createAlert(hospitalId, unitName, unitCount);
      }
    }
  }

  async createAlert(hospitalId, bloodType, currentUnits) {
    //TODO: avoid duplicated alerts
    console.log('Alert', {
      hospitalId,
      bloodType,
      currentUnits,
    });
    //     const existing = await Alert.findOne({
    //       where: {
    //         hospital_id: hospitalId,
    //         blood_type: bloodType,
    //         status: 'NEW',
    //       },
    //     });
    //     if (existing) return;
    //     const alert = await Alert.create({
    //       hospital_id: hospitalId,
    //       blood_type: bloodType,
    //       current_units: currentUnits,
    //       threshold,
    //       status: 'NEW',
    //     });
    //     await this.notificationService.sendHospitalAlert(alert);
  }
}
