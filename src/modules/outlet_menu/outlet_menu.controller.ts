import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
} from '@nestjs/common';

import { OutletMenuService } from './outlet_menu.service';
import { UpdateOutletMenuPriceDto } from './dto/update-outlet_menu_price.dto';

@Controller()
export class OutletMenuController {
    constructor(
        private readonly outletMenuService: OutletMenuService,
    ) { }

    // GET /outlets/:outletId/menu
    @Get('outlets/:outletId/menu')
    findOutletMenu(
        @Param('outletId') outletId: string,
    ) {
        return this.outletMenuService.findOutletMenu(outletId);
    }

    // POST /outlets/:outletId/menu-items/:itemId/assign
    @Post('outlets/:outletId/menu-items/:itemId/assign')
    assignMenuItem(
        @Param('outletId') outletId: string,
        @Param('itemId') itemId: string,
    ) {
        return this.outletMenuService.assignMenuItem(
            outletId,
            itemId,
        );
    }

    // PATCH /outlets/:outletId/menu-items/:itemId/price
    @Patch('outlets/:outletId/menu-items/:itemId/price')
    updateMenuItemPrice(
        @Param('outletId') outletId: string,
        @Param('itemId') itemId: string,
        @Body() updatePriceDto: UpdateOutletMenuPriceDto,
    ) {
        return this.outletMenuService.updateMenuItemPrice(
            outletId,
            itemId,
            updatePriceDto.price,
        );
    }

    // POST /outlets/:outletId/menu-items/bulk-assign
    // @Post('outlets/:outletId/menu-items/bulk-assign')
    // bulkAssignMenuItems(
    //     @Param('outletId') outletId: string,
    //     @Body() bulkAssignDto: BulkAssignMenuItemsDto,
    // ) {
    //     return this.outletMenuService.bulkAssignMenuItems(
    //         outletId,
    //         bulkAssignDto.itemIds,
    //     );
    // }
}