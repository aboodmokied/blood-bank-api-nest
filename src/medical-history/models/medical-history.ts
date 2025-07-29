import { CustomModel } from "src/custom-model/custom-model";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Table } from "sequelize-typescript";
import { Donor } from "src/user/donor.model";
import { MedicalHistoryLog } from "./medical-history-logs";
import { Role } from "src/types/auth.types";


@Table({
    tableName: 'medical_histories'
})
export class MedicalHistory extends CustomModel {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare condition: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare allergies: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare surgeries: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare notes: string;

    @Column({ defaultValue: 'donor' })
      declare role: Role;

    @ForeignKey(() => Donor)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare donorId: number;

    @BelongsTo(() => Donor)
    declare donor: Donor;

    @HasMany(() => MedicalHistoryLog)
    declare medicalHistoryLogs: MedicalHistoryLog[];

}
