import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Get('outlet/:outletId')
    findByOutletId(@Param('outletId') outletId: string) {
        return this.salesService.findByOutletId(outletId);
    }

    @Get('revenue/outlets')
    getOutletWiseRevenue(
        @Query('start_date') start_date?: string,
        @Query('end_date') end_date?: string,
        @Query('outlet_id') outlet_id?: string,
    ) {
        return this.salesService.getOutletWiseRevenue({
            start_date,
            end_date,
            outlet_id,
        });
    }

    @Get('top-selling-items')
    getTopSellingItems(
        @Query('start_date') start_date?: string,
        @Query('end_date') end_date?: string,
        @Query('outlet_id') outlet_id?: string,
    ) {
        return this.salesService.getTopSellingItems({
            start_date,
            end_date,
            outlet_id,
        });
    }

}
