import { Column, DataType, HasMany, Table } from "sequelize-typescript";
import { BloodInventory } from "src/blood-inventory/models/blood-inventory.model";
import { CustomModel } from "src/custom-model/custom-model";
import { Donor } from "src/user/donor.model";

@Table({
    tableName: "blood_types"
})

export class BloodType extends CustomModel {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare type: string;

    @HasMany(() => Donor)
    declare donors?: Donor[];

    @HasMany(() => BloodInventory)
    declare bloodInventories?: BloodInventory[];
}


