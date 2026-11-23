
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
import { toDefaultValue } from 'sequelize/lib/utils';

@Table({
    tableName: 'inventory_items',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'name'],
        },
    ],
})
export class InventoryItem extends Model<InventoryItem> {
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

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    sku: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    base_unit: string;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: '0.000',
    })
    declare standard_cost: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    is_active: boolean;

    @BelongsTo(() => Company)
    company: Company;
}
