import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
@Table({
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
})

export class Role extends Model<Role> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING })
    declare description: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    declare is_active: boolean;

}