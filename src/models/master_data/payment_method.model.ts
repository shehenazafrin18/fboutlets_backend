import { Table, Model, Column, DataType, Default } from 'sequelize-typescript';

@Table({
    tableName: 'payment_methods',
    timestamps: true,
    paranoid: true,
})
export class PaymentMethod extends Model<PaymentMethod> {

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare code: string;

    @Column({ type: DataType.STRING })
    declare description: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    declare is_active: boolean;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare sort_order: number;
}