// src/medical-history/entities/medical-history-log.entity.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { MedicalHistory } from './medical-history.model';
import { Role } from 'src/types/auth.types';

@Table({ tableName: 'medical_history_logs' })
export class MedicalHistoryLog extends Model {

  @Column(DataType.STRING)
  action: 'CREATE' | 'UPDATE';

  @Column(DataType.STRING)
  changedBy: string;

  @Column(DataType.JSON)
  changes: any;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  timestamp: Date;

  @Column({ defaultValue: 'donor' })
  declare role: Role;

  @ForeignKey(() => MedicalHistory)
  @Column(DataType.INTEGER)
  medicalHistoryId: number;

  @BelongsTo(() => MedicalHistory)
  medicalHistory: MedicalHistory;
}