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
    HasMany,
    CreatedAt,
    UpdatedAt,
    Index,
    AutoIncrement,
} from 'sequelize-typescript';

import { Company } from './company.model';
import { MenuItem } from './menu_items.model';

@Table({
    tableName: 'menu_categories',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'name'],
        },
    ],
})
export class MenuCategory extends Model<MenuCategory> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare company_id: number;

    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare name: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare description: string;

    @AllowNull(true)
    @Column(DataType.STRING(255))
    declare image: string;

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare display_order: number;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare status: boolean;

    @BelongsTo(() => Company)
    declare company: Company;

    @HasMany(() => MenuItem)
    declare menu_items: MenuItem[];

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;
}