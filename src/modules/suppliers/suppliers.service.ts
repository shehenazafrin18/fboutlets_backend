import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Supplier } from '../../models/suppliers.model';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { COMPANY_ID } from '@/common/constants';

@Injectable()
export class SuppliersService {

  constructor(
    @InjectModel(Supplier)
    private readonly supplierModel: typeof Supplier,
  ) { }

  async create(createSupplierDto: CreateSupplierDto) {

    return this.supplierModel.create({
      ...createSupplierDto,
      company_id: COMPANY_ID,
    });
  }

  async findAll() {
    return this.supplierModel.findAll({
      where: {
        company_id: COMPANY_ID,
        is_active: true
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number,) {
    const supplier = await this.supplierModel.findOne({
      where: {
        id
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.findOne(id);


    await supplier.update({
      ...updateSupplierDto,
      company_id: COMPANY_ID,
    });

    return supplier;
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);

    await supplier.destroy();

    return {
      message: 'Supplier deleted successfully',
    };
  }
}
