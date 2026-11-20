import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/user.model';
import { UserRole } from '../../models/master_data/user_role.model';
import { Role } from '../../models/master_data/role.model';
import { Menu } from '../../models/master_data/menu.model';
import { RoleMenuPermission } from '../../models/master_data/role_menu_permission.model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRole, Role, Menu, RoleMenuPermission]),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
