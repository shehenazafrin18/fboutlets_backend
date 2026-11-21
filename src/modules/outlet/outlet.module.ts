import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutletController } from './outlet.controller';
import { OutletService } from './outlet.service';
import { Company } from '@/models/company.model';
import { Outlet } from '@/models/outlet.model';

@Module({
  imports: [SequelizeModule.forFeature([Outlet, Company])],
  controllers: [OutletController],
  providers: [OutletService]
})
export class OutletModule { }
