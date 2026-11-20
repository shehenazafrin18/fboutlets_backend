import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../../modules/user/user.model";
import { Role } from "./role.model";

@Table({
  tableName: 'user_roles',
  timestamps: true,
  paranoid: true,
})
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  })
  declare user_id: number;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  })
  declare user: User;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  })
  declare role_id: number;

  @BelongsTo(() => Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE'
  })
  role: Role;
}
