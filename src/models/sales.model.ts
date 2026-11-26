
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';

import { Company } from './company.model';
import { Outlet } from './outlet.model';
import { SaleItem } from './sales_items.model';

export enum SaleStatus {
    DRAFT = 'DRAFT',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PARTIAL = 'PARTIAL',
    PAID = 'PAID',
}

@Table({
    tableName: 'sales',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['outlet_id', 'invoice_no'],
        },
        {
            fields: ['company_id', 'outlet_id', 'sale_date'],
        },
    ],
})
export class Sale extends Model<Sale> {
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

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    invoice_no: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    sale_date: Date;

    @Column({
        type: DataType.DECIMAL(12, 2),
        defaultValue: 0,
    })
    subtotal: number;

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

    @Column({
        type: DataType.ENUM('UNPAID', 'PARTIAL', 'PAID'),
        defaultValue: PaymentStatus.UNPAID,
    })
    payment_status: PaymentStatus;

    @Column({
        type: DataType.ENUM('DRAFT', 'COMPLETED', 'CANCELLED'),
        defaultValue: SaleStatus.DRAFT,
    })
    sale_status: SaleStatus;

    @Column({
        type: DataType.ENUM('CASH', 'CARD', 'MOBILE_BANKING'),
        allowNull: false,
    })
    payment_method: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: true,
    })
    customer_name: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    customer_phone: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    notes: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    created_by: string;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsTo(() => Outlet)
    outlet: Outlet;

    @HasMany(() => SaleItem)
    sale_items: SaleItem[];
}
