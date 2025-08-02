import { Controller, Post, Body, Get } from '@nestjs/common';
import { BloodTypeService } from './blood-type.servies';

@Controller('blood-types')
export class BloodTypeController {
  constructor(private readonly bloodTypeService: BloodTypeService) {}

  @Post('create')
  async create(@Body('type') type: string) {
    return this.bloodTypeService.create(type);
  }

  @Get()
  async findAll() {
    return this.bloodTypeService.findAll();
  }
}