import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    Unique,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
} from 'sequelize-typescript';

@Table({
    tableName: 'companies',
    timestamps: true,
    underscored: true,
})
export class Company extends Model<Company> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    declare name: string;

    @AllowNull(false)
    @Unique
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

    @AllowNull(true)
    @Column(DataType.STRING(255))
    declare logo: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare status: boolean;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at?: Date;
}