import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BloodRequestService } from './blood-request.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';

@Controller('blood-requests')
export class BloodRequestController {
  constructor(private readonly bloodRequestService: BloodRequestService) {}

  
  @Post('create')
  async create(@Body() createDto: CreateBloodRequestDto) {
    return this.bloodRequestService.createRequest(createDto);
  }

//   @Get(':id/status')
//   async getStatus(@Param('id') id: number) {
//     return this.bloodRequestService.getRequestStatus(+id);
//   }
}