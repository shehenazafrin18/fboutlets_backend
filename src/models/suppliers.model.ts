
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'suppliers',
    timestamps: true,
})
export class Supplier extends Model<Supplier> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare company_id: number;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    declare name: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    declare contact_person: string;

    @AllowNull(true)
    @Column(DataType.STRING(30))
    declare phone: string;

    @AllowNull(true)
    @Column(DataType.STRING(150))
    declare email: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare address: string;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    declare tax_number: string;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_active: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt?: Date;
}
