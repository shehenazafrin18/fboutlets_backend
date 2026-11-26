import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/user.model';
import { UserRole } from '../../models/master_data/user_role.model';
import { Role } from '../../models/master_data/role.model';
import { Menu } from '../../models/master_data/menu.model';
import { RoleMenuPermission } from '../../models/master_data/role_menu_permission.model';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserOutlet } from '@/models/user_outlet.model';
import { Outlet } from '@/models/outlet.model';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [User, UserRole, Role, Menu, RoleMenuPermission, UserOutlet, Outlet]
    ),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard,],
  exports: [
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule { }


