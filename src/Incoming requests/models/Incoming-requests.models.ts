import {
    Column,
    DataType,
    Table,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { BloodRequest } from 'src/blood-request/models/blood-request.model';
import { Receiver } from 'src/receiver/models/receiver.model';

@Table({ tableName: 'incoming_requests' })
export class IncomingRequest extends CustomModel {

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Received' })
    declare status: string; 

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare receivedAt: Date;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare notes: string;

     @ForeignKey(() => BloodRequest)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare bloodRequestId: number;

    @BelongsTo(() => BloodRequest)
    bloodRequest: BloodRequest;

    @ForeignKey(() => Receiver)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare receiverId: number;

    @BelongsTo(() => Receiver)
    receiver: Receiver;
}