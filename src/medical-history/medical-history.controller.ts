import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { MedicalHistoryService } from './medical-history.service';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @RolesDecorator('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMedicalHistory(
    @Body() createMedicalHistoryDto: CreateMedicalHistoryDto,
  ) {
    const { medicalHistory } =
      await this.medicalHistoryService.createMedicalHistory(
        createMedicalHistoryDto,
      );
    return { medicalHistory };
  }

  @RolesDecorator('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateMedicalHistory(
    @Param('id') id: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    const { updatedMedicalHistory } =
      await this.medicalHistoryService.updateMedicalHistory(
        +id,
        updateMedicalHistoryDto,
      );
    return { updatedMedicalHistory };
  }

  // @RolesDecorator('doctor')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMedicalHistoriesByDonorId(@Param('id') donorId: string) {
    const { medicalHistories } =
      await this.medicalHistoryService.getMedicalHistoriesByDonorId(+donorId);
    return { medicalHistories };
  }
}
