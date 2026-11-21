import { Injectable } from '@nestjs/common';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Injectable()
export class OutletService {
    public async create(createOutletDto: CreateOutletDto) {
        return 'This action adds a new outlet';
    }

    public async findAll() {
        return `This action returns all outlets`;
    }

    public async findOne(id: number) {
        return `This action returns a #${id} outlet`;
    }

    public async update(id: number, updateOutletDto: UpdateOutletDto) {
        return `This action updates a #${id} outlet`;
    }

    public async remove(id: number) {
        return `This action removes a #${id} outlet`;
    }
}
