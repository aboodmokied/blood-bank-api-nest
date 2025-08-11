import { CustomModel } from 'src/custom-model/custom-model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Hospital } from 'src/user/hopsital.model';

@Table({
  tableName: 'blood_requests',
})
export class BloodRequest extends CustomModel {
  @ForeignKey(() => Hospital)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare fromHospitalId: number;

  @ForeignKey(() => Hospital)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare toHospitalId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare bloodType: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare qty: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare urgencyLevel: number;

  @Column({ type: DataType.STRING, defaultValue: Date.now })
  declare requestedAt: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare approvedAt: string;
}
