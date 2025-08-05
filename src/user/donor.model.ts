import { Table, Column, DataType, HasOne, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { MedicalHistory } from 'src/medical-history/models/medical-history.model';
import { Role } from 'src/types/auth.types';


@Table({
  tableName:'donors'
})
export class Donor extends CustomModel{
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

  @HasMany(() => MedicalHistory)
  declare medicalHistory?: MedicalHistory;

  @Column({ defaultValue: 'donor' })
  declare role: Role;
}
