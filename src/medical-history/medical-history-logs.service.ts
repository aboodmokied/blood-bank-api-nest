import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MedicalHistoryLog } from "./models/medical-history-logs";
import { MedicalHistory } from "./models/medical-history";
import { CreateMedicalHistoryDto } from "./dto/create-medical-history.dto";
import { UpdateMedicalHistoryDto } from "./dto/update-medical-history.dto";
import { Donor } from "src/user/donor.model";


@Injectable()
export class MedicalHistoryServiceLogs {
    constructor(
        @InjectModel(MedicalHistory) private readonly historyModel: typeof MedicalHistory,
        @InjectModel(MedicalHistoryLog) private readonly logModel: typeof MedicalHistoryLog
    ) { }

    async createLogs(createMedicalHistoryDto: CreateMedicalHistoryDto ) {
        const medicalHistory = await this.historyModel.findOne({
            where: { donorId: createMedicalHistoryDto.donorId }
        });
        if (medicalHistory) {
            throw new ConflictException('Medical history already exists for this donor');
        }

        const record = await this.historyModel.create({ ...createMedicalHistoryDto });

        await this.logModel.create({
            medicalHistoryId: record.id,
            action: 'CREATE',
            changedBy: Donor.name,
            changes: createMedicalHistoryDto,
        });

        return record;
    }

    async update(updateMedicalHistoryDto: UpdateMedicalHistoryDto, donor: Donor) {
        const record = await this.historyModel.findOne({ where: { donorId: updateMedicalHistoryDto.donorId } });
        if (!record) throw new NotFoundException('Record not found');

        const oldData = { ...record.toJSON() };
        await record.update(updateMedicalHistoryDto);

        await this.logModel.create({
            medicalHistoryId: record.id,
            action: 'UPDATE',
            changedBy: donor.name,
            changes: {
                before: oldData,
                after: updateMedicalHistoryDto
            }
        });

        return record;
    }
}

