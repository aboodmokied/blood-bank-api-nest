import { Controller, Post, Body } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';

@Controller('medical-tests')
export class MedicalTestController {
  constructor(private readonly service: MedicalTestService) {}

  @Post()
  conductTest(@Body() dto: CreateMedicalTestDto) {
    return this.service.runTests(dto);
  }
}
