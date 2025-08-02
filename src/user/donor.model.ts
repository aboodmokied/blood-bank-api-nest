import { Table, Column, DataType, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BloodType } from 'src/blood-types/models/blood-type.model';
import { CustomModel } from 'src/custom-model/custom-model';
import { MedicalHistory } from 'src/medical-history/models/medical-history';
import { Role } from 'src/types/auth.types';


@Table({
  tableName: 'donors'
})
export class Donor extends CustomModel {
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


  @ForeignKey(() => BloodType)
  @Column
  declare bloodTypeId?: number;

  @BelongsTo(() => BloodType)
  declare bloodType?: BloodType;

  @Column({ defaultValue: 'donor' })
  declare role: Role;
}
