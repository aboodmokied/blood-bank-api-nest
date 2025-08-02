import { Table, Column, ForeignKey, DataType, BelongsTo, HasMany } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Hospital } from './hopsital.model';
import { BloodRequest } from 'src/blood-request/models/blood-request.model';


@Table({ tableName: 'medical_officers' })
export class MedicalOfficer extends CustomModel {
    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @ForeignKey(() => Hospital)
    @Column
    hospitalId: number;

    @BelongsTo(() => Hospital)
    hospital: Hospital;

    @HasMany(() => BloodRequest)
    bloodRequests?: BloodRequest[];

}