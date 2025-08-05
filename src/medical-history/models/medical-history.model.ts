import { CustomModel } from 'src/custom-model/custom-model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Donor } from 'src/user/donor.model';

@Table({
  tableName: 'medical_histories',
})
export class MedicalHistory extends CustomModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare condition: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare diagnosedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare notes: string;

  @ForeignKey(() => Donor)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare donorId: number;

  @BelongsTo(() => Donor)
  declare donor: Donor;
}
