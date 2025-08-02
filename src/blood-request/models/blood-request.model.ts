import { Table, Column, ForeignKey, DataType, BelongsTo, HasOne } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { BloodType } from 'src/blood-types/models/blood-type.model';
import { Receiver } from 'src/receiver/models/receiver.model';
import { MedicalOfficer } from 'src/user/medical-officer.model';
import { Hospital } from 'src/user/hopsital.model';
import { IncomingRequest } from 'src/Incoming requests/models/Incoming-requests.models';


@Table({ tableName: 'blood_requests' })
export class BloodRequest extends CustomModel {

  @Column({ type: DataType.INTEGER })
  declare quantity: number;

  @Column({
    type: DataType.ENUM('normal', 'urgent', 'critical'),
    defaultValue: 'normal',
  })
  declare urgency: 'normal' | 'urgent' | 'critical';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Under review',
  })
  declare status: string;


  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string;

  @ForeignKey(() => MedicalOfficer)
  @Column
  declare officerId: number;

  @BelongsTo(() => MedicalOfficer)
  declare officer: MedicalOfficer;

  @ForeignKey(() => BloodType)
  @Column
  declare bloodTypeId: number;

  @BelongsTo(() => BloodType)
  declare bloodType: BloodType;

  @ForeignKey(() => Hospital)
  @Column
  declare hospitalId: number;

  @BelongsTo(() => Hospital)
  declare hospital: Hospital;

  @ForeignKey(() => Receiver)
  @Column
  declare receiverId: number;

  @BelongsTo(() => Receiver)
  declare receiver: Receiver;

  @HasOne(() => IncomingRequest)
  incomingRequest: IncomingRequest;


}