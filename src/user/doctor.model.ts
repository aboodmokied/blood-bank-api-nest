import { Table, Column, DataType } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Role } from 'src/types/auth.types';


@Table({
  tableName:'doctors'
})
export class Doctor extends CustomModel{
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

  @Column({ defaultValue: 'doctor' })
  declare role: Role;
}
