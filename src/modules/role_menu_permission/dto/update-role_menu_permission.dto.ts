import { PartialType } from '@nestjs/swagger';
import { CreateRoleMenuPermissionDto } from './create-role_menu_permission.dto';

export class UpdateRoleMenuPermissionDto extends PartialType(CreateRoleMenuPermissionDto) {}
