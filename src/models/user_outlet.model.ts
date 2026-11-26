import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    Index,
    Default,
} from 'sequelize-typescript';

import { User } from '@/modules/user/user.model';
import { Outlet } from './outlet.model';

@Table({
    tableName: 'user_outlets',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'outlet_id'],
        },
    ],
})
export class UserOutlet extends Model<UserOutlet> {

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => User)
    @Index
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare user_id: number;

    @ForeignKey(() => Outlet)
    @Index
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare outlet_id: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare is_default: boolean;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare is_active: boolean;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => Outlet)
    declare outlet: Outlet;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;
}