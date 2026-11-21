import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
@Injectable()
export class CompanyService {

    public async create(createCompanyDto: CreateCompanyDto) {
        return 'This action adds a new company';
    }

    public async findAll() {
        return `This action returns all companies`;
    }

    public async findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    public async update(id: number, updateCompanyDto: UpdateCompanyDto) {
        return `This action updates a #${id} company`;
    }

    public async remove(id: number) {
        return `This action removes a #${id} company`;
    }
}
