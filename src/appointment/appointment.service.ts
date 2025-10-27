import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment, AppointmentStatus } from './appointment.model';
import { Op } from 'sequelize';

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

  async findByDay(day: string, page = 1, limit = 10) {
    const start = new Date(day);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const { data: appointments, pagination } =
      await this.appointmentModel.findWithPagination(page, limit, {
        where: {
          date: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      });

    return { appointments, pagination };
  }

  async findByDonor(id: number, page = 1, limit = 10) {
    const { data: appointments, pagination } =
      await this.appointmentModel.findWithPagination(page, limit, {
        where: { donorId: id },
      });

    return { appointments, pagination };
  }

  async findByHospital(id: number, page = 1, limit = 10, search?: string) {
    if (search) {
      const { data: appointments, pagination } =
        await this.appointmentModel.findWithPaginationAndSearch(
          page,
          limit,
          {
            where: { hospitalId: id },
          },
          search,
          ['date', 'donorId'],
        );

      return { appointments, pagination };
    } else {
      const { data: appointments, pagination } =
        await this.appointmentModel.findWithPagination(page, limit, {
          where: { hospitalId: id },
        });

      return { appointments, pagination };
    }
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

  async changeStatus(id: number, newStatus: AppointmentStatus) {
    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const allowedStatuses: AppointmentStatus[] = [
      'pending',
      'confirmed',
      'cancelled',
      'completed',
      'missed',
    ];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException('Invalid status');
    }

    appointment.status = newStatus;
    await appointment.save();

    return appointment;
  }

  async cancleAppointment(id: number) {
    const appointment = await this.appointmentModel.findByPk(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const allowedStatuses = ['pending', 'confirmed'];

    if (!allowedStatuses.includes(appointment.status)) {
      throw new BadRequestException('Invalid status');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return appointment;
  }
}
