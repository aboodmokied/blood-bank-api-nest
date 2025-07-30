import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CreateMedicalHistoryDto } from "./dto/create-medical-history.dto";
import { MedicalHistoryService } from "./medical-history.service";
import { RolesDecorator } from "src/roles/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/roles/guards/roles.guard";
import { UpdateMedicalHistoryDto } from "./dto/update-medical-history.dto";




@Controller('medical-history')

export class MedicalHistoryController {
    constructor(private readonly medicalHistoryService: MedicalHistoryService) { }

    @RolesDecorator('doctor')
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

    @RolesDecorator('doctor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getMedicalHistoryByDonorId(@Param('id') donorId: number, @Req() request: any) {
        const role = request.user?.role;
        return this.medicalHistoryService.getMedicalHistoryByDonorId(donorId, role);
    }

}

