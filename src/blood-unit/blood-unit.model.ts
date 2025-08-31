import {
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Donation } from 'src/donation/donation.model';
import { MedicalTest } from 'src/medical-test/medical-test.model';

export enum UnitStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

@Table({
  tableName: 'blood_units',
  timestamps: true,
})
export class BloodUnit extends CustomModel {
  @ForeignKey(() => Donation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare donationId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bloodType: string;

  @Column({
    type: DataType.ENUM(...Object.values(UnitStatus)),
    allowNull: false,
    defaultValue: UnitStatus.PENDING,
  })
  declare status: UnitStatus;

  @Column({
    type: DataType.DATE,
    defaultValue: Date.now,
  })
  declare collectedAt: string;

  @BelongsTo(() => Donation)
  declare donation: Donation;

  @HasOne(() => MedicalTest)
  declare medicalTest: MedicalTest;
}
