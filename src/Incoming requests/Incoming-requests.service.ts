import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateIncomingRequestDto } from './dto/create-incoming-request.dto';
import { IncomingRequest } from './models/Incoming-requests.models';
import { UpdateIncomingRequestDto } from './dto/update-incoming-request.dto';


@Injectable()
export class IncomingRequestService {
  constructor(
    @InjectModel(IncomingRequest) private incomingRequestModel: typeof IncomingRequest,
  ) {}


  async findAll() {
    return await this.incomingRequestModel.findAll({
      include: ['bloodRequest', 'receiver'],
    });
  }


}