import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BloodRequest } from './models/blood-request.model';
import { BloodInventory } from 'src/blood-inventory/models/blood-inventory.model';
import { MedicalHistoryLog } from 'src/medical-history/models/medical-history-logs';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { BloodType } from 'src/blood-types/models/blood-type.model';
import { Hospital } from 'src/user/hopsital.model';
import { Receiver } from 'src/receiver/models/receiver.model';
import { IncomingRequest } from 'src/Incoming requests/models/Incoming-requests.models';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectModel(BloodRequest) private bloodRequestModel: typeof BloodRequest,
    @InjectModel(BloodInventory) private bloodInventoryModel: typeof BloodInventory,
    @InjectModel(MedicalHistoryLog) private logModel: typeof MedicalHistoryLog,
    @InjectModel(BloodType) private bloodTypeModel: typeof BloodType,
    @InjectModel(Hospital) private hospitalModel: typeof Hospital,
    @InjectModel(Receiver) private receiverModel: typeof Receiver,
    @InjectModel(IncomingRequest) private incomingRequestModel: typeof IncomingRequest,

  ) { }

  async createRequest(data: CreateBloodRequestDto) {
    const bloodType = await this.bloodTypeModel.findOne({
      where: { type: data.bloodType },
    });

    if (!bloodType) {
      throw new NotFoundException('Blood type not found');
    }

    const hospital = await this.hospitalModel.findByPk(data.hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // const receiver = await this.receiverModel.findByPk(data.receiverId);
    // if (!receiver) {
    //   throw new NotFoundException('Receiver not found');
    // }

    const request = await this.bloodRequestModel.create({
      bloodType: data.bloodType,
      quantity: data.quantity,
      urgency: data.urgency,
      medicalOfficerId: data.medicalOfficerId,
      hospitalId: data.hospitalId,
      notes: data.notes,
      status: 'Under review',
    });

    const receiver = await this.receiverModel.findOne();
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    await this.incomingRequestModel.create({
      bloodRequestId: request.id,
      receiverId: receiver.id,
      status: 'Request created',
      note: data.notes,
    });

    const inventory = await this.bloodInventoryModel.findOne({
      where: { bloodTypeId: bloodType.id },
    });

    if (!inventory || inventory.quantity < data.quantity) {
      await this.logModel.create({
        requestId: request.id,
        status: 'The type is not available. Another bank has been contacted.',
      });
    } else {
      inventory.quantity -= data.quantity;
      await inventory.save();

      await this.logModel.create({
        requestId: request.id,
        status: 'The required quantity of stock has been secured. Blood will be delivered soon.',
      });

      request.status = 'Ready for delivery';
      await request.save();
    }

    return request;
  }
}
