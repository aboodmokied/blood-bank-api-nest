import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BloodRequest } from './blood-request.model';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';
import { Op } from 'sequelize';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectModel(BloodRequest)
    private readonly bloodRequestModel: typeof BloodRequest,
  ) {}

  async create(dto: CreateBloodRequestDto) {
    const bloodRequest = await this.bloodRequestModel.create({
      ...dto,
      requestedAt: new Date().toISOString(),
    });
    return { bloodRequest };
  }

  async findAll() {
    const bloodRequests = await this.bloodRequestModel.findAll();
    return { bloodRequests };
  }

  async findOne(id: number) {
    const bloodRequest = await this.bloodRequestModel.findByPk(id);
    if (!bloodRequest) {
      throw new NotFoundException('Blood request not found');
    }
    return { bloodRequest };
  }

  async update(id: number, dto: UpdateBloodRequestDto) {
    const { bloodRequest } = await this.findOne(id);
    const updatedBloodRequest = await bloodRequest.update(dto);
    return { updatedBloodRequest };
  }

  async remove(id: number): Promise<void> {
    const { bloodRequest } = await this.findOne(id);
    await bloodRequest.destroy();
  }

  async hospitalBloodRequests(hospitalId: number) {
    const bloodRequests = await this.bloodRequestModel.findAll({
      where: {
        [Op.or]: [{ fromHospitalId: hospitalId }, { toHospitalId: hospitalId }],
      },
    });
    return { bloodRequests };
  }
}
