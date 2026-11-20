// import { Table, Model, Column, DataType, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
// import { Role } from './role.model';

// @Table({
//   tableName: 'role_menu_permissions',
//   timestamps: true,
//   paranoid: true,
// })
// export class RoleMenuPermission extends Model<RoleMenuPermission> {
//   @PrimaryKey
//   @AutoIncrement
//   @Column(DataType.INTEGER)
//   declare id: number;

//   @Column({ type: DataType.INTEGER, allowNull: false })
//   declare role_id: number;

//   @Column({ type: DataType.INTEGER, allowNull: false })
//   declare menu_id: number;

//   @BelongsTo(() => Role, 'role_id')
//   role: Role;
// }



import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';

import { Role } from './role.model';
import { Menu } from './menu.model';

@Table({
  tableName: 'role_menu_permissions',
  timestamps: true,
})
export class RoleMenuPermission extends Model<RoleMenuPermission> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Role)
  @Unique('unique_role_menu')
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare role_id: number;

  @ForeignKey(() => Menu)
  @Unique('unique_role_menu')
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare menu_id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare can_view: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare can_create: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare can_edit: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare can_delete: boolean;

  @BelongsTo(() => Role, 'role_id')
  role: Role;

  @BelongsTo(() => Menu, 'menu_id')
  menu: Menu;
}