import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { CreateIncomingRequestDto } from './dto/create-incoming-request.dto';
import { UpdateIncomingRequestDto } from './dto/update-incoming-request.dto';
import { IncomingRequestService } from './Incoming-requests.service';

@Controller('incoming-requests')
export class IncomingRequestController {
  constructor(private readonly service: IncomingRequestService) {}


  @Get()
  findAll() {
    return this.service.findAll();
  }

}