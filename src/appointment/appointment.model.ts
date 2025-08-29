import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Donor } from 'src/user/donor.model';
import { Hospital } from 'src/user/hopsital.model';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'missed';

@Table
export class Appointment extends CustomModel {
  @ForeignKey(() => Hospital)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare hospitalId: number;

  @ForeignKey(() => Donor)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare donorId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'confirmed',
      'cancelled',
      'completed',
      'missed',
    ),
    allowNull: false,
  })
  declare status: AppointmentStatus;
}
