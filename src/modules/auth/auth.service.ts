import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

import { UserRole } from '../../models/master_data/user_role.model';
import { Role } from '../../models/master_data/role.model';
import { Menu } from '../../models/master_data/menu.model';
import { RoleMenuPermission } from '../../models/master_data/role_menu_permission.model';
import { UserOutlet } from '@/models/user_outlet.model';
import { Outlet } from '@/models/outlet.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private m_user: typeof User,
    @InjectModel(UserRole)
    private m_user_role: typeof UserRole,
    @InjectModel(Role)
    private m_role: typeof Role,
    @InjectModel(Outlet)
    private m_outlet: typeof Outlet,
    @InjectModel(UserOutlet)
    private m_user_outlet: typeof UserOutlet,
    @InjectModel(Menu)
    private m_menu: typeof Menu,
    @InjectModel(RoleMenuPermission)
    private m_role_menu_permission: typeof RoleMenuPermission,
    private jwtService: JwtService,
  ) { }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    // console.log(hash);
    return hash;
  }



  public async register(dto: RegisterDto) {
    try {
      console.log(dto);
      const pass = await this.hashPassword(dto.password);
      await this.m_user.create({ ...dto, password: pass } as any);
      return 'This action registers a new user';
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async login(dto: any) {
    try {
      const user = await this.m_user.findOne({ where: { email: dto.email } });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      //get role and permissions of the user
      const userData = user.toJSON();
      const userRoles = await this.m_user_role.findAll({ where: { user_id: user.id } });
      const role_ids = userRoles.map((userRole) => userRole.role_id);
      const roles = await this.m_role.findAll({ where: { id: role_ids } });
      const roleMenuPermissions = await this.m_role_menu_permission.findAll({ where: { role_id: role_ids } });
      const menu_ids = roleMenuPermissions.map((roleMenuPermission) => roleMenuPermission.menu_id);
      const menuAccess = await this.m_menu.findAll({ where: { id: menu_ids } });
      const userOutlets = await this.m_user_outlet.findAll({
        where: {
          user_id: user.id,
          is_active: true,
        },
      });

      const outlet_ids = userOutlets.map(
        (item) => item.outlet_id
      );
      const outlets = await this.m_outlet.findAll({ where: { id: outlet_ids } });

      // console.log({ roles, menuAccess });

      // JWT payload
      const payload = {
        sub: user.id,
        email: user.email,
        roles: role_ids,
        outlets: outlet_ids
      };

      return {
        ...userData,
        roles,
        outlets,
        menuAccess,
        access_token: this.jwtService.sign(payload),
      };

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}

