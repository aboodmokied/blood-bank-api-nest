import { Column, Table, DataType } from "sequelize-typescript";
import { CustomModel } from "src/custom-model/custom-model";
import { Role } from "src/types/auth.types";

@Table({
    tableName: "profiles",
})

export class ProfileModel extends CustomModel {
    @Column({
        allowNull: false,
    })
    declare gender: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare age: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare location: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare birthdate: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare photo: string;

    @Column({ defaultValue: 'donor' })
    declare role: Role;
}

