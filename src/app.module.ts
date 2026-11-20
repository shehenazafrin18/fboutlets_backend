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
        RoleMenuPermission
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
