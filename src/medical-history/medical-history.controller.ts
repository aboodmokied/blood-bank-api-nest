import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateMedicalHistoryDto } from "./dto/create-medical-history.dto";
import { MedicalHistoryService } from "./medical-history.service";
import { RolesDecorator } from "src/roles/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/roles/guards/roles.guard";
import { UpdateMedicalHistoryDto } from "./dto/update-medical-history.dto";
import { MedicalHistoryServiceLogs } from "./medical-history-logs.service";


@Controller('medical-history')

export class MedicalHistoryController {
    constructor(private readonly medicalHistoryService: MedicalHistoryService,
                private readonly medicalHistoryServiceLogs: MedicalHistoryServiceLogs
    ) { }

    @RolesDecorator('donor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    createMedicalHistory(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
        return this.medicalHistoryService.createMedicalHistory(createMedicalHistoryDto);
    }

    @RolesDecorator('doctor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('update')
    @HttpCode(HttpStatus.OK)
    updateMedicalHistory(@Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
        return this.medicalHistoryService.updateMedicalHistory(updateMedicalHistoryDto);
    }

    @RolesDecorator('doctor', 'donor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getMedicalHistoryByDonorId(@Param('id') createMedicalHistoryDto: CreateMedicalHistoryDto) {
        return this.medicalHistoryService.getMedicalHistoryByDonorId(createMedicalHistoryDto);
    }

    @RolesDecorator('doctor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('createLogs')
    @HttpCode(HttpStatus.CREATED)
    createLogs(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
        return this.medicalHistoryServiceLogs.createLogs(createMedicalHistoryDto);
    }
    
}

