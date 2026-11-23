import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.model';
import { Upazila } from './models/upazila.model';
import { District } from './models/district.model';
import { Division } from './models/division.model';
import { UserType } from './models/master_data/user_type.model';
import { UserRoleModule } from './modules/user_role/user_role.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserRole } from './models/master_data/user_role.model';
import { Role } from './models/master_data/role.model';
import { Menu } from './models/master_data/menu.model';
import { RoleMenuPermission } from './models/master_data/role_menu_permission.model';
import { MenuModule } from './modules/menu/menu.module';
import { MenuCategoriesModule } from './modules/menu_categories/menu_categories.module';
import { OutletMenuModule } from './modules/outlet_menu/outlet_menu.module';
import { CompanyModule } from './modules/company/company.module';
import { OutletModule } from './modules/outlet/outlet.module';
import { InventoriesModule } from './modules/inventories/inventories.module';
import { InventoryTransactionsModule } from './modules/inventory_transactions/inventory_transactions.module';
import { SalesModule } from './modules/sales/sales.module';
import { SalesItemsModule } from './modules/sales_items/sales_items.module';
import { OutletReceiptCountersModule } from './modules/outlet_receipt_counters/outlet_receipt_counters.module';
import { Company } from './models/company.model';
import { Outlet } from './models/outlet.model';
import { MenuCategory } from './models/menu_categories.model';
import { MenuItem } from './models/menu_items.model';
import { OutletMenu } from './models/outlet_menu.model';
import { InventoryItem } from './models/inventory_items.model';
import { InventoryTransaction } from './models/inventory_transactions.model';
import { Inventory } from './models/inventories.model';
import { Sale } from './models/sales.model';
import { SaleItem } from './models/sales_items.model';
import { OutletReceiptCounter } from './models/outlet_receipt_counters.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { InventoryItemModule } from './modules/inventory_item/inventory_item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
      models: [
        User,
        Division,
        District,
        Upazila,
        UserType,
        UserRole,
        Role,
        Menu,
        RoleMenuPermission,
        Company,
        Outlet,
        MenuCategory,
        MenuItem,
        OutletMenu,
        InventoryItem,
        InventoryTransaction,
        Inventory,
        Sale,
        SaleItem,
        OutletReceiptCounter
      ],
      // logging: console.log
    }),
    AuthModule,
    UserModule,
    UserRoleModule,
    RolesModule,
    MenuModule,
    RoleMenuPermission,
    JwtModule,
    MenuCategoriesModule,
    OutletMenuModule,
    CompanyModule,
    OutletModule,
    InventoriesModule,
    InventoryTransactionsModule,
    SalesModule,
    SalesItemsModule,
    OutletReceiptCountersModule,
    InventoryItemModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService
  ],
})
export class AppModule { }
