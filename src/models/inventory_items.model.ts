
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

@Table({
    tableName: 'inventory_items',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'sku'],
        },
        {
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
    company_id: string;

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
        type: DataType.STRING(20),
        allowNull: false,
    })
    base_unit: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    is_active: boolean;

    @BelongsTo(() => Company)
    company: Company;
}
