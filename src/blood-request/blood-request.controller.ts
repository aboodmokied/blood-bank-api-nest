import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BloodRequestService } from './blood-request.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';

@Controller('blood-requests')
export class BloodRequestController {
  constructor(private readonly service: BloodRequestService) {}

  @Post()
  create(@Body() dto: CreateBloodRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('hospital/:id')
  findAllHospitalBloodRequests(@Param('id', ParseIntPipe) id: number) {
    return this.service.hospitalBloodRequests(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBloodRequestDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
