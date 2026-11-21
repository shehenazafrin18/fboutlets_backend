import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
} from '@nestjs/common';

import { InventoryTransactionsService } from './inventory_transactions.service';
import { CreateInventoryTransactionsDto } from './dto/create-inventory_transactions.dto';

@Controller('inventory-transactions')
export class InventoryTransactionsController {
    constructor(
        private readonly inventoryTransactionsService: InventoryTransactionsService,
    ) { }

    // POST /inventory-transactions
    @Post()
    create(
        @Body() createInventoryTransactionDto: CreateInventoryTransactionsDto,
    ) {
        return this.inventoryTransactionsService.create(
            createInventoryTransactionDto,
        );
    }

    // GET /inventory-transactions
    @Get()
    findAll(@Query() query: any) {
        return this.inventoryTransactionsService.findAll(query);
    }

    // GET /inventory-transactions/:id/details
    @Get(':id/details')
    findDetails(@Param('id') id: string) {
        return this.inventoryTransactionsService.findDetails(+id);
    }

    // GET /inventory-transactions/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryTransactionsService.findOne(+id);
    }
}
