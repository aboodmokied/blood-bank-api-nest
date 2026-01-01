import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalHistory } from './models/medical-history.model';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { Donor } from 'src/user/donor.model';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistoryLog } from './models/medical-history-logs';
import { Doctor } from 'src/user/doctor.model';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectModel(MedicalHistory)
    private readonly medicalHistoryModel: typeof MedicalHistory,
    @InjectModel(Donor) private readonly donorModel: typeof Donor,
    @InjectModel(MedicalHistoryLog)
    private readonly medicalHistoryLogModel: typeof MedicalHistoryLog,
  ) {}

  async createMedicalHistory(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const donor = await this.donorModel.findByPk(
      createMedicalHistoryDto.donorId,
    );
    if (!donor) {
      throw new NotFoundException('Donor Not Found');
    }

    const newMedicalHistory = await this.medicalHistoryModel.create({
      ...createMedicalHistoryDto,
      donorId: createMedicalHistoryDto.donorId,
    });
    return { medicalHistory: newMedicalHistory };
  }

  async updateMedicalHistory(
    id: number,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    const { donorId } = updateMedicalHistoryDto;
    const donor = await this.donorModel.findByPk(donorId);
    if (!donor) {
      throw new NotFoundException('Donor Not Found');
    }

    const medicalHistory = await this.medicalHistoryModel.findByPk(id);

    if (!medicalHistory) {
      throw new NotFoundException('Medical history not found');
    }

    const updatedMedicalHistory = await medicalHistory.update(
      updateMedicalHistoryDto,
    );

    return { updatedMedicalHistory };
  }

  async getMedicalHistoriesByDonorId(donorId: number) {
    const medicalHistories = await this.medicalHistoryModel.findAll({
      where: { donorId },
      include: [{ model: Donor, attributes: ['id', 'name', 'email'] }],
    });

    return { medicalHistories };
  }
}
