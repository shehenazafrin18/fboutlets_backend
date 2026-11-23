import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
} from 'sequelize-typescript';

import { Company } from './company.model';

@Table({
    tableName: 'outlets',
    timestamps: true,
    underscored: true,
})
export class Outlet extends Model<Outlet> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare company_id: string;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    declare name: string;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    declare code: string;

    @AllowNull(true)
    @Column(DataType.STRING(150))
    declare email: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    declare phone: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare address: string;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_active: boolean;

    @BelongsTo(() => Company)
    declare company: Company;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;
}