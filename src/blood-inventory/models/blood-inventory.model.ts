import { Table, Column, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { CustomModel } from 'src/custom-model/custom-model';
import { BloodType } from 'src/blood-types/models/blood-type.model';
import { Hospital } from 'src/user/hopsital.model';


@Table({ tableName: 'blood_inventory' })
export class BloodInventory extends CustomModel {

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare quantity: number;

  
  @ForeignKey(() => BloodType)
  @Column
  declare bloodTypeId: number;

  @BelongsTo(() => BloodType)
  declare bloodType: BloodType;
}
