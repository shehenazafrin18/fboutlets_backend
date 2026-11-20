import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'division',
    timestamps: true,
})
export class Division extends Model<Division> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING)
    declare name: string;

    @Column(DataType.STRING)
    declare code: string;

    @Column(DataType.STRING)
    declare description: string;

    @Column(DataType.BOOLEAN)
    declare is_active: boolean;

}