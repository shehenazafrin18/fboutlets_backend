
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    AutoIncrement,
    PrimaryKey,
} from 'sequelize-typescript';

import { Company } from './company.model';
import { Outlet } from './outlet.model';

@Table({
    tableName: 'outlet_receipt_counters',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['outlet_id'],
        },
        {
            fields: ['company_id'],
        },
    ],
})
export class OutletReceiptCounter extends Model<OutletReceiptCounter> {
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

    @ForeignKey(() => Outlet)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    outlet_id: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'INV',
    })
    prefix: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: 0,
    })
    current_number: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 6,
    })
    padding_length: number;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsTo(() => Outlet)
    outlet: Outlet;
}
