import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { Outlet } from '@/models/outlet.model';
import { COMPANY_ID } from '@/common/constants';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class OutletService {
    constructor(
        @InjectModel(Outlet)
        private readonly outletModel: typeof Outlet,
    ) { }
    public async create(createOutletDto: CreateOutletDto) {
        return 'This action adds a new outlet';
    }

    public async findAll() {
        return this.outletModel.findAll({
            where: { is_active: true },
            order: [['created_at', 'DESC']],
        });
    }

    public async findOne(id: number) {
        const outlet = await this.outletModel.findByPk(id);

        if (!outlet) {
            throw new NotFoundException('Outlet not found');
        }

        return outlet;
    }

    public async update(id: number, updateOutletDto: UpdateOutletDto) {
        return `This action updates a #${id} outlet`;
    }

    public async remove(id: number) {
        return `This action removes a #${id} outlet`;
    }
}
