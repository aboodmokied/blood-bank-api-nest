import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalHistory } from './models/medical-history';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { Donor } from 'src/user/donor.model';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistoryLog } from './models/medical-history-logs';
import { Doctor } from 'src/user/doctor.model';




@Injectable()

export class MedicalHistoryService {
    constructor(
        @InjectModel(MedicalHistory) private readonly medicalHistoryModel: typeof MedicalHistory,
        @InjectModel(Donor) private readonly donorModel: typeof Donor,
        @InjectModel(MedicalHistoryLog) private readonly medicalHistoryLogModel: typeof MedicalHistoryLog
    ) { }

    async createMedicalHistory(createMedicalHistoryDto: CreateMedicalHistoryDto) {

        const donor = await this.donorModel.findByPk(createMedicalHistoryDto.donorId);
        if (!donor) {
            throw new NotFoundException('Donor Not Found');
        }

        const existingHistory = await this.medicalHistoryModel.findOne({
            where: { donorId: createMedicalHistoryDto.donorId },
        });

        if (existingHistory) {
            throw new NotFoundException('This donor already has a medical history.');
        }

        const newMedicalHistory = await this.medicalHistoryModel.create({
            ...createMedicalHistoryDto,
            donorId: createMedicalHistoryDto.donorId
        });

        await this.medicalHistoryLogModel.create({
            medicalHistoryId: newMedicalHistory.id,
            action: 'CREATE',
            changedBy: Doctor.name,
            changes: JSON.stringify(createMedicalHistoryDto),
            // timestamp: new DATE()
        })

        return newMedicalHistory;

    }

    async updateMedicalHistory(updateMedicalHistoryDto: UpdateMedicalHistoryDto) {

        const donor = await this.donorModel.findByPk(updateMedicalHistoryDto.donorId);
        if (!donor) {
            throw new NotFoundException('Donor Not Found');
        }

        const medicalHistory = await this.medicalHistoryModel.findOne({
            where: { donorId: updateMedicalHistoryDto.donorId },
        });

        if (!medicalHistory) {
            throw new NotFoundException('Medical history not found');
        }

        const updated = await medicalHistory.update(updateMedicalHistoryDto);

        await this.medicalHistoryLogModel.create({
            medicalHistoryId: updated.id,
            action: 'UPDATE',
            changedBy: Doctor.name,
            changes: JSON.stringify(updateMedicalHistoryDto),
            // timestamp: new Date(),
            
        });

        return updated;
    }

    async getMedicalHistoryByDonorId(donorId: number, role: string) {
        const medicalHistory = await this.medicalHistoryModel.findOne({
            where: { donorId },
            include: [{ model: Donor, attributes: ['id', 'name', 'email'] }]
        });

        if (!medicalHistory) {
            throw new NotFoundException('Medical history not found for this donor');
        }

        return medicalHistory;
    }
}

