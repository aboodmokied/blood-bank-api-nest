import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Hospital } from 'src/user/hopsital.model';

export type BroadcastStatus = 'active' | 'expired';

@Table({
  tableName: 'broadcasts',
})
export class Broadcast extends CustomModel {
  @ForeignKey(() => Hospital)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare hospitalId: number;

  @BelongsTo(() => Hospital)
  declare hospital: Hospital;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bloodType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare message?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare donorsNotified: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: BroadcastStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare expiresAt?: Date;
}
