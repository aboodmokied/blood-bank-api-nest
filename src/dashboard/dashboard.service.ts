import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from 'src/appointment/appointment.model';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';
import { Broadcast } from 'src/broadcast/broadcast.model';
import { Donation } from 'src/donation/donation.model';
import { Donor } from 'src/user/donor.model';
import { MedicalTest } from 'src/medical-test/medical-test.model';
import { Role } from 'src/types/auth.types';
import { Op } from 'sequelize';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Donor) private donorModel: typeof Donor,
    @InjectModel(Donation) private donationModel: typeof Donation,
    @InjectModel(Appointment) private appointmentModel: typeof Appointment,
    @InjectModel(Broadcast) private broadcastModel: typeof Broadcast,
    @InjectModel(BloodUnit) private bloodUnitModel: typeof BloodUnit,
    @InjectModel(MedicalTest) private medicalTestModel: typeof MedicalTest,
  ) {}

  async getStats(userId: number, role: Role) {
    switch (role) {
      case 'donor':
        return this.getDonorStats(userId);
      case 'hospital':
        return this.getHospitalStats(userId);
      case 'doctor':
        return this.getDoctorStats(userId);
      default:
        return {};
    }
  }

  private async getDonorStats(userId: number) {
    const donor = await this.donorModel.findByPk(userId);
    
    const totalDonations = await this.donationModel.count({
      where: { donorId: userId, status: 'stored' },
    });

    const upcomingAppointment = await this.appointmentModel.findOne({
      where: {
        donorId: userId,
        status: 'pending', 
      },
      order: [['date', 'ASC']],
    });
    const activeBroadcastsCount = await this.broadcastModel.count({
      where: {
        bloodType: donor?.bloodType,
        status: 'active',
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    let nextEligibilityDate: Date | null = null;
    if (donor?.lastDonationDate) {
      const lastDate = new Date(donor.lastDonationDate);
      lastDate.setMonth(lastDate.getMonth() + 4);
      nextEligibilityDate = lastDate;
    }

    return {
      role: 'donor',
      totalDonations,
      isEligible: donor?.isEligible ?? false,
      nextEligibilityDate,
      activeBroadcastsCount,
      upcomingAppointment,
      bloodType: donor?.bloodType,
    };
  }

  private async getHospitalStats(hospitalId: number) {
    const totalStock = await this.bloodUnitModel.sum('volume', {
      where: { hospitalId, status: 'passed' }, // passed means it went through medical test
    }) || 0;

    const pendingAppointmentsCount = await this.appointmentModel.count({
      where: { hospitalId, status: 'pending' },
    });

    const activeBroadcastsCount = await this.broadcastModel.count({
      where: { hospitalId, status: 'active', expiresAt: { [Op.gt]: new Date() } },
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCollections = await this.donationModel.count({
      where: {
        hospitalId,
        donationDate: { [Op.gt]: oneWeekAgo },
      },
    });
    const discardedUnitsCount = await this.bloodUnitModel.count({
      where: { hospitalId, status: 'failed' },
    });

    const discardedUnitsVolume = await this.bloodUnitModel.sum('volume', {
      where: { hospitalId, status: 'failed' },
    }) || 0;

    return {
      role: 'hospital',
      totalStock,
      pendingAppointmentsCount,
      activeBroadcastsCount,
      recentCollections,
      discardedUnitsCount,
      discardedUnitsVolume,
    };
  }

  private async getDoctorStats(doctorId: number) {
    // Current assumption: Doctor sees all pending units for medical testing
    // In future, might need hospital linkage
    
    const pendingTestsCount = await this.bloodUnitModel.count({
      where: { status: 'pending' },
    });

    const conductedTestsCount = await this.medicalTestModel.count();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayAppointmentsCount = await this.appointmentModel.count({
      where: {
        date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        status: 'pending',
      },
    });

    return {
      role: 'doctor',
      pendingTestsCount,
      conductedTestsCount,
      todayAppointmentsCount,
    };
  }
}
