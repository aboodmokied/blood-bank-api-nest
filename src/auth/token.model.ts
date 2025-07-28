import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from 'src/types/auth.types';
import { User } from 'src/user/user.model';

@Table({
  tableName:'tokens'
})
export class Token extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  declare signature: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue:false
  })
  declare revoked: boolean;

  // @ForeignKey(()=>User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: Role;


//   relations
  // @BelongsTo(()=>User)
  // user:User;
}