import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Index,
    AutoIncrement,
    PrimaryKey,
    HasMany,
} from 'sequelize-typescript';

import { Company } from './company.model';
import { Outlet } from './outlet.model';
import { InventoryItem } from './inventory_items.model';
import { OutletMenu } from './outlet_menu.model';

@Table({
    tableName: 'inventories',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['outlet_id', 'inventory_item_id'],
        },
        {
            fields: ['company_id', 'outlet_id'],
        },
    ],
})
export class Inventory extends Model<Inventory> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Company)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    company_id: number;

    @ForeignKey(() => Outlet)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    outlet_id: number;

    @ForeignKey(() => InventoryItem)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    inventory_item_id: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
    })
    quantity: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
    })
    reserved_quantity: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
    })
    reorder_level: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    unit: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    is_active: boolean;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsTo(() => Outlet)
    outlet: Outlet;

    @BelongsTo(() => InventoryItem)
    inventory_item: InventoryItem;

    @HasMany(() => OutletMenu, {
        foreignKey: 'outlet_id',
        sourceKey: 'outlet_id',
        as: 'outlet_menus',
    })
    outlet_menus: OutletMenu[];
}