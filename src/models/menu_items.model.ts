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
import { MenuCategory } from './menu_categories.model';

@Table({
    tableName: 'menu_items',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'sku'],
        },
        {
            fields: ['category_id'],
        },
    ],
})
export class MenuItem extends Model<MenuItem> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare company_id: number;

    @ForeignKey(() => MenuCategory)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare category_id: number;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    declare name: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare description: string;

    @AllowNull(true)
    @Column(DataType.STRING(255))
    declare image: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    declare sku: string;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    declare base_price: string;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare status: boolean;

    @BelongsTo(() => Company)
    declare company: Company;

    @BelongsTo(() => MenuCategory)
    declare category: MenuCategory;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;
}