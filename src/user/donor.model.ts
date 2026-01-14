import { Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { MedicalHistory } from 'src/medical-history/models/medical-history.model';
import { Role } from 'src/types/auth.types';
import { Donation } from 'src/donation/donation.model';

@Table({
  tableName: 'donors',
})
export class Donor extends CustomModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare bloodType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare password: string;

  @HasMany(() => MedicalHistory)
  declare medicalHistory?: MedicalHistory[];

  @HasMany(() => Donation)
  declare donations?: Donation[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastDonationDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isEligible: boolean;

  @Column({ defaultValue: 'donor' })
  declare role: Role;
}
