import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalTestService } from './medical-test.service';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';
import { UpdateMedicalTestDto } from './dto/update-medical-test.dto';

@Controller('medical-test')
export class MedicalTestController {
  constructor(private readonly medicalTestService: MedicalTestService) {}

  @Post()
  create(@Body() createMedicalTestDto: CreateMedicalTestDto) {
    return this.medicalTestService.create(createMedicalTestDto);
  }

  @Get()
  findAll() {
    return this.medicalTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalTestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalTestDto: UpdateMedicalTestDto) {
    return this.medicalTestService.update(+id, updateMedicalTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalTestService.remove(+id);
  }
}
