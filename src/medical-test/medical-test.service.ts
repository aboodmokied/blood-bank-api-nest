import { Injectable } from '@nestjs/common';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';
import { UpdateMedicalTestDto } from './dto/update-medical-test.dto';

@Injectable()
export class MedicalTestService {
  create(createMedicalTestDto: CreateMedicalTestDto) {
    return 'This action adds a new medicalTest';
  }

  findAll() {
    return `This action returns all medicalTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalTest`;
  }

  update(id: number, updateMedicalTestDto: UpdateMedicalTestDto) {
    return `This action updates a #${id} medicalTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalTest`;
  }
}
