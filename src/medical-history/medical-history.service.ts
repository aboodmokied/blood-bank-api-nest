import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalHistory } from './models/medical-history';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { Donor } from 'src/user/donor.model';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';


@Injectable()

export class MedicalHistoryService {
    constructor(
        @InjectModel(MedicalHistory) private readonly medicalHistoryModel: typeof MedicalHistory,
        @InjectModel(Donor) private readonly donorModel: typeof Donor
    ) { }

    async createMedicalHistory(createMedicalHistoryDto: CreateMedicalHistoryDto) {
        const donor = await this.donorModel.findByPk(createMedicalHistoryDto.donorId);
        if (!donor) {
            throw new NotFoundException('Donor not found');
        }

        return this.medicalHistoryModel.create({
            ...createMedicalHistoryDto,
            donorId: donor.id
        });
    }

    async updateMedicalHistory(updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
        const medicalHistory = await this.medicalHistoryModel.findOne({
            where: { donorId: updateMedicalHistoryDto.donorId }
        });
        if (!medicalHistory) {
            throw new NotFoundException('Medical history not found');
        }

        return await medicalHistory.update(updateMedicalHistoryDto);
    }

    async getMedicalHistoryByDonorId(createMedicalHistoryDto: CreateMedicalHistoryDto) {
        const medicalHistory = await this.medicalHistoryModel.findOne({
            where: { donorId: createMedicalHistoryDto.donorId }, 
            include: [{ model: Donor, attributes: ['id', 'name', 'email'] }]
        });
        if (!medicalHistory) {
            throw new NotFoundException('Medical history not found for this donor');
        }
        return medicalHistory;
    }
}

