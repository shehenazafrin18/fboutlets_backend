import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Division } from "./division.model";

@Table({
    tableName: 'district',
    timestamps: true,
})
export class District extends Model<District> {
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

    @ForeignKey(() => Division)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare division_id: number;

    @BelongsTo(() => Division)
    declare division: Division;
}