import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from './appointment.model';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment)
    private appointmentModel: typeof Appointment,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointment = await this.appointmentModel.create({
      ...createAppointmentDto,
    });
    return { appointment };
  }

  async findAll(page = 1, limit = 10) {
    const { data: appointments, pagination } =
      await this.appointmentModel.findWithPagination(page, limit);
    return { appointments, pagination };
  }

  async findOne(id: number) {
    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException('appointment not found');
    }
    return { appointment };
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException('appointment not found');
    }
    await appointment.update({ updateAppointmentDto });
    return { message: 'appointment updated sucessfully', appointment };
  }

  async remove(id: number) {
    await this.appointmentModel.destroy({ where: { id } });
    return { message: 'appointment deleted sucessfully' };
  }
}
