import { Table, Model, Column, DataType, Default, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import { RoleMenuPermission } from './role_menu_permission.model';


@Table({
  tableName: 'menus',
  timestamps: true,
  paranoid: true,
})
export class Menu extends Model<Menu> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare icon: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare remarks: string;


  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;
}
