
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

import { Purchase } from './purchases.model';
import { InventoryItem } from './inventory_items.model';

@Table({
    tableName: 'purchase_items',
    timestamps: true,
})
export class PurchaseItem extends Model<PurchaseItem> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @ForeignKey(() => Purchase)
    @Column(DataType.INTEGER)
    declare purchase_id: number;

    @AllowNull(false)
    @ForeignKey(() => InventoryItem)
    @Column(DataType.INTEGER)
    declare inventory_item_id: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(12, 3))
    declare quantity: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(12, 3))
    declare unit_price: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    declare discount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    declare tax: number;

    @AllowNull(false)
    @Column(DataType.DECIMAL(12, 2))
    declare total_price: number;

    @BelongsTo(() => Purchase)
    declare purchase: Purchase;

    @BelongsTo(() => InventoryItem)
    declare inventory_item: InventoryItem;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt?: Date;
}
