import { Table, Column, DataType } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { Role } from 'src/types/auth.types';


@Table({
    tableName: 'forget_passwords'
})
export class ForgetPassword extends CustomModel {

    @Column({ allowNull: true })
    declare passwordChangedAt: Date;

    @Column({ allowNull: true })
    declare passwordResetCode: string;

    @Column({ allowNull: true })
    declare passwordResetExpires: Date;

    @Column({ defaultValue:false })
    declare passwordResetVerified: boolean;

    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ defaultValue: 'user' })
    declare role: Role;
}
