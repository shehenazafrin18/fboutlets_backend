
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Index,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';

import { Company } from './company.model';
import { Outlet } from './outlet.model';
import { InventoryItem } from './inventory_items.model';

export enum InventoryTransactionType {
    IN = 'IN',
    OUT = 'OUT',
    SALE = 'SALE',
    ADJUSTMENT = 'ADJUSTMENT',
}

@Table({
    tableName: 'inventory_transactions',
    timestamps: true,
    updatedAt: false,
    indexes: [
        {
            fields: ['company_id', 'outlet_id'],
        },
        {
            fields: ['inventory_item_id', 'createdAt'],
        },
        {
            fields: ['transaction_type'],
        },
    ],
})
export class InventoryTransaction extends Model<InventoryTransaction> {
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
        type: DataType.ENUM('IN', 'OUT', 'ADJUSTMENT'),
        allowNull: false,
    })
    transaction_type: InventoryTransactionType;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: true,
    })
    previous_quantity: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: true,
    })
    new_quantity: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    reference_id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    remarks: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    created_by: number;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsTo(() => Outlet)
    outlet: Outlet;

    @BelongsTo(() => InventoryItem)
    inventory_item: InventoryItem;
}
