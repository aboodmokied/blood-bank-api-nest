import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BloodType } from './models/blood-type.model';

@Injectable()
export class BloodTypeService {
    constructor(
        @InjectModel(BloodType) private bloodTypeModel: typeof BloodType,
    ) { }

    async create(type: string) {
        const validTypes = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

        if (!validTypes.includes(type)) {
            throw new BadRequestException(`Invalid blood type "${type}". Please use one of the following: ${validTypes.join(', ')}`);
        }
        const existing = await this.bloodTypeModel.findOne({ where: { type } });
        if (existing) {
            return existing;
        }

        return this.bloodTypeModel.create({ type });
    }

    async findAll() {
        return this.bloodTypeModel.findAll();
    }
}