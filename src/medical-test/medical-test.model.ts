import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Donation } from 'src/donation/donation.model';

export enum TestResult {
  PASSED = 'passed',
  FAILED = 'failed',
}

@Table({ tableName: 'medical_tests', timestamps: true })
export class MedicalTest extends CustomModel {
  @ForeignKey(() => Donation)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare donationId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare hiv: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare hepatitis: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare malaria: string;

  @Column({
    type: DataType.ENUM(...Object.values(TestResult)),
    allowNull: false,
  })
  declare result: TestResult;

  @BelongsTo(() => Donation)
  declare donation: Donation;
}
