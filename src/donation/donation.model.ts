import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Donor } from 'src/user/donor.model';
import { Hospital } from 'src/user/hopsital.model';
import { Appointment } from 'src/appointment/appointment.model';

export type DonationStatus = 'collected' | 'tested' | 'stored' | 'discarded';

@Table
export class Donation extends CustomModel {
  @ForeignKey(() => Donor)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare donorId: number;

  @ForeignKey(() => Hospital)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare hospitalId: number;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare appointmentId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare donationDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bloodType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare volume: number; // e.g., in milliliters

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'collected',
  })
  declare status: DonationStatus;
}
