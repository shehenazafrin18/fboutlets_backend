import { Module } from '@nestjs/common';
import { RoleMenuPermissionService } from './role_menu_permission.service';
import { RoleMenuPermissionController } from './role_menu_permission.controller';

@Module({
  controllers: [RoleMenuPermissionController],
  providers: [RoleMenuPermissionService],
})
export class RoleMenuPermissionModule {}
