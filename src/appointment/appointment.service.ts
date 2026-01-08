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
import { Donor } from 'src/user/donor.model';

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

  async findByDay(day: string, page = 1, limit = 10, search?: string) {
    const start = new Date(day);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const where: any = {
      date: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
      status: 'pending',
    };

    const include: any[] = [];
    if (search) {
      include.push({
        model: Donor,
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
    } else {
       // Also include Donor just for display if needed, but the search requires the where clause
       // If we want to show donor name in the table, we should probably always include it.
       // However, `findWithPagination` might not support complex includes if not handled carefully.
       // Let's assume we can include it.
       include.push({ model: Donor });
    }

    if (search) {
         // If searching, we skip the generic findWithPagination if it doesn't support complex includes well,
         // or we use findAndCountAll like findByHospital.
         // Let's use findAndCountAll to be consistent and safe.
         const { count, rows } = await this.appointmentModel.findAndCountAll({
             where,
             include,
             limit,
             offset: (page - 1) * limit,
             order: [['date', 'DESC']],
         });
         return {
            appointments: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
         }
    }
    const { data: appointments, pagination } =
      await this.appointmentModel.findWithPagination(page, limit, {
        where,
        include:[{model:Donor}]
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
      const { count, rows } = await this.appointmentModel.findAndCountAll({
        where: {
          hospitalId: id,
        },
        include: [
          {
            model: Donor,
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          },
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['date', 'DESC']],
      });

      return {
        appointments: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
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
      'cancelled',
      'completed',
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

    const allowedStatuses = ['pending'];

    if (!allowedStatuses.includes(appointment.status)) {
      throw new BadRequestException('Invalid status');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return appointment;
  }
}
