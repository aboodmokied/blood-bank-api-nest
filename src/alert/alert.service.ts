import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  constructor() // private bloodUnitRepo: BloodUnitRepository,
  // private thresholdRepo: ThresholdRepository,
  // private alertRepo: AlertRepository,
  // private notificationService: NotificationService
  {}

  async checkAllHospitalsStock() {
    // const hospitals = await Hospital.findAll();
    // for (const hospital of hospitals) {
    //   await this.checkHospitalStock(hospital.id);
    // }
  }

  async checkHospitalStock(hospitalId: number) {
    // const thresholds = await this.thresholdRepo.findByHospital(hospitalId);
    // for (const item of thresholds) {
    //   const { blood_type, min_units } = item;
    //   const currentUnits = await this.bloodUnitRepo.countAvailableByType(
    //     hospitalId,
    //     blood_type,
    //   );
    //   if (currentUnits < min_units) {
    //     await this.createAlert(
    //       hospitalId,
    //       blood_type,
    //       currentUnits,
    //       min_units,
    //     );
    //   }
    // }
  }

  async createAlert(hospitalId, bloodType, currentUnits, threshold) {
    // avoid duplicated alerts
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
