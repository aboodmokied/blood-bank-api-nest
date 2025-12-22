import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { User } from 'src/user/user.model';

@Table
export class Alert extends CustomModel {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hospital_id: number;

  @BelongsTo(() => User)
  hospital: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  blood_type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  current_units: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  threshold: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'NEW',
  })
  status: string;
}
