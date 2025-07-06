import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';

@Table
export class User extends Model{
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
}
