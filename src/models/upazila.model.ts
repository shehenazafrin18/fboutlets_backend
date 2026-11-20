import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { District } from "./district.model";

@Table({
    tableName: 'upazila',
    timestamps: true,
})
export class Upazila extends Model<Upazila> {
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

    @ForeignKey(() => District)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare district_id: number;

}