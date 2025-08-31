import {
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { BloodUnit } from 'src/blood-unit/blood-unit.model';

export enum TestResult {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

@Table({
  tableName: 'medical_tests',
  timestamps: true,
})
export class MedicalTest extends CustomModel {
  @ForeignKey(() => BloodUnit)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare bloodUnitId: number;

  @Column({
    type: DataType.ENUM(...Object.values(TestResult)),
    allowNull: false,
    defaultValue: TestResult.PENDING,
  })
  declare result: TestResult;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare report: string;

  @BelongsTo(() => BloodUnit)
  declare bloodUnit: BloodUnit;
}
