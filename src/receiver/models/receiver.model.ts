import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { IncomingRequest } from 'src/Incoming requests/models/Incoming-requests.models';

@Table({ tableName: 'receivers' })
export class Receiver extends CustomModel {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare contactInfo: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare age: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare gender: string;

  @HasMany(() => IncomingRequest)
  incomingRequests: IncomingRequest[];

}