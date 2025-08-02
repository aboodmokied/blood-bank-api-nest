import { Table, Column, DataType, HasOne, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Role } from 'src/types/auth.types';
import { MedicalOfficer } from './medical-officer.model';
import { BloodRequest } from 'src/blood-request/models/blood-request.model';


@Table({
  tableName: 'hospitals'
})
export class Hospital extends CustomModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

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

  @HasOne(() => MedicalOfficer)
  medicalOfficers?: MedicalOfficer[];

  @HasMany(() => BloodRequest)
  bloodRequests?: BloodRequest[];

  @Column({ defaultValue: 'hospital' })
  declare role: Role;
}
