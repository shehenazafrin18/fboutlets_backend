import { Module } from '@nestjs/common';
import { UserOutletsService } from './user-outlets.service';
import { UserOutletsController } from './user-outlets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserOutlet } from '@/models/user_outlet.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';
import { UserRole } from '@/models/master_data/user_role.model';
import { Menu } from '@/models/master_data/menu.model';
import { RoleMenuPermission } from '@/models/master_data/role_menu_permission.model';
import { Role } from '@/models/master_data/role.model';
import { JwtModule } from '@nestjs/jwt';
import { Outlet } from '@/models/outlet.model';


@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Outlet,
      UserOutlet,
      UserRole,
      Role,
      Menu,
      RoleMenuPermission,
    ]),
    JwtModule,
  ],
  controllers: [UserOutletsController],
  providers: [
    UserOutletsService,
    AuthService,
  ],
  exports: [
    UserOutletsService,
  ],
})
export class UserOutletsModule { }
