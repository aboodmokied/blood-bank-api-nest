import { Injectable } from '@nestjs/common';
import { CreateBloodUnitDto } from './dto/create-blood-unit.dto';
import { UpdateBloodUnitDto } from './dto/update-blood-unit.dto';
import { InjectModel } from '@nestjs/sequelize';
import { BloodUnit } from './blood-unit.model';

@Injectable()
export class BloodUnitService {
  constructor(
    @InjectModel(BloodUnit) private bloodUnitModel: typeof BloodUnit,
  ) {}

  async create(createBloodUnitDto: CreateBloodUnitDto) {
    return this.bloodUnitModel.create({ ...createBloodUnitDto });
  }

  findAll() {
    return `This action returns all bloodUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bloodUnit`;
  }

  update(id: number, updateBloodUnitDto: UpdateBloodUnitDto) {
    return `This action updates a #${id} bloodUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} bloodUnit`;
  }
}
