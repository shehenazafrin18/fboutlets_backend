import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
} from 'sequelize-typescript';

import { Outlet } from './outlet.model';
import { MenuItem } from './menu_items.model';

@Table({
    tableName: 'outlet_menus',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['outlet_id', 'menu_item_id'],
        },
    ],
})
export class OutletMenu extends Model<OutletMenu> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Outlet)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare outlet_id: number;

    @ForeignKey(() => MenuItem)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare menu_item_id: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare selling_price: number;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_available: boolean;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;

    @BelongsTo(() => Outlet)
    declare outlet: Outlet;

    @BelongsTo(() => MenuItem)
    declare menu_item: MenuItem;
}