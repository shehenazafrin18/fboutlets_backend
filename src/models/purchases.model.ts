
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';

import { Supplier } from './suppliers.model';
import { PurchaseItem } from './purchase_items.model';

@Table({
    tableName: 'purchases',
    timestamps: true,
})
export class Purchase extends Model<Purchase> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare company_id: number;

    @AllowNull(false)
    @ForeignKey(() => Supplier)
    @Column(DataType.INTEGER)
    declare supplier_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare outlet_id: number;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    declare purchase_number: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    declare purchase_date: Date;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    declare total_amount: number;

    @AllowNull(false)
    @Default('draft')
    @Column(DataType.ENUM(
        'draft',
        'ordered',
        'partially_received',
        'received',
        'cancelled'
    ))
    declare status: string;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare created_by: number;

    @BelongsTo(() => Supplier)
    declare supplier: Supplier;

    @HasMany(() => PurchaseItem)
    declare purchase_items: PurchaseItem[];

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt?: Date;
}
