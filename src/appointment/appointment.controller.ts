import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './appointment.model';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // Create appointment
  @Post()
  @HttpCode(201)
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  // Get all appointments (with pagination)
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.appointmentService.findAll(Number(page), Number(limit));
  }

  // Get appointment by id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.appointmentService.findOne(Number(id));
  }

  // Get appointments by specific day
  @Get('day/:day')
  async findByDay(
    @Param('day') day: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appointmentService.findByDay(day, Number(page), Number(limit));
  }

  // Get appointments by donor
  @Get('donor/:id')
  async findByDonor(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appointmentService.findByDonor(
      Number(id),
      Number(page),
      Number(limit),
    );
  }

  // Get appointments by hospital
  @Get('hospital/:id')
  async findByHospital(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.appointmentService.findByHospital(
      Number(id),
      Number(page),
      Number(limit),
      search,
    );
  }

  // Update appointment
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(Number(id), updateAppointmentDto);
  }

  // Delete appointment
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.appointmentService.remove(Number(id));
  }

  // Change appointment status
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: number,
    @Body('status') newStatus: AppointmentStatus,
  ) {
    return this.appointmentService.changeStatus(Number(id), newStatus);
  }

  @Patch(':id/cancle')
  async cancleAppointment(@Param('id') id: number) {
    return this.appointmentService.cancleAppointment(Number(id));
  }
}
