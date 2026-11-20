import { Division } from '../../models/division.model';
import { District } from '../../models/district.model';
import { Upazila } from '../../models/upazila.model';
import {
    Model,
    Table,
    Column,
    DataType, PrimaryKey,
    AutoIncrement, AllowNull, Unique, Default,
    ForeignKey
} from 'sequelize-typescript';

@Table({
    tableName: 'user',
    timestamps: true,
})

export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare first_name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare last_name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare user_name: string;

    @Unique
    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare address: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    declare is_active: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    declare is_blocked: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    declare gender: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare description: string;

    @ForeignKey(() => Division)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare division_id: number;

    @ForeignKey(() => District)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare district_id: number;

    @ForeignKey(() => Upazila)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare upazila_id: number;
}