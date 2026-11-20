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
    declare outlet_id: string;

    @ForeignKey(() => MenuItem)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare menu_item_id: string;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare selling_price: string;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_available: boolean;

    @BelongsTo(() => Outlet)
    declare outlet: Outlet;

    @BelongsTo(() => MenuItem)
    declare menu_item: MenuItem;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;
}