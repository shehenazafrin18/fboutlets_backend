import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { MenuItem } from './menu_items.model';
import { InventoryItem } from './inventory_items.model';

@Table({
    tableName: 'menu_recipes',
    timestamps: true,
})
export class MenuRecipe extends Model<MenuRecipe> {

    @ForeignKey(() => MenuItem)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    menu_item_id: number;

    @ForeignKey(() => InventoryItem)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    inventory_item_id: number;

    @Column({
        type: DataType.DECIMAL(12, 3),
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
    })
    status: string;

    @BelongsTo(() => MenuItem)
    menu_item: MenuItem;

    @BelongsTo(() => InventoryItem)
    inventory_item: InventoryItem;
}