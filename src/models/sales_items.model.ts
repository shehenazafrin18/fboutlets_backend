
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
} from 'sequelize-typescript';

import { Sale } from './sales.model';
import { MenuItem } from './menu_items.model';

@Table({
    tableName: 'sale_items',
    timestamps: true,
    indexes: [
        {
            fields: ['sale_id'],
        },
        {
            fields: ['menu_item_id'],
        },
    ],
})
export class SaleItem extends Model<SaleItem> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Sale)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sale_id: string;

    @ForeignKey(() => MenuItem)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    menu_item_id: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    item_name: string;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
    })
    unit_price: number;

    @Column({
        type: DataType.DECIMAL(12, 2),
        defaultValue: 0,
    })
    discount_amount: number;

    @Column({
        type: DataType.DECIMAL(12, 2),
        defaultValue: 0,
    })
    tax_amount: number;

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
    })
    total_amount: number;

    @BelongsTo(() => Sale)
    sale: Sale;

    @BelongsTo(() => MenuItem)
    menu_item: MenuItem;
}
