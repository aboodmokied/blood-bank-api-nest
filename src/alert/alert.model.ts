import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Hospital } from 'src/user/hopsital.model';
// import { User } from 'src/user/user.model';

@Table
export class Alert extends CustomModel {
  @ForeignKey(() => Hospital)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hospital_id: number;

  @BelongsTo(() => Hospital)
  hospital: Hospital;

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
