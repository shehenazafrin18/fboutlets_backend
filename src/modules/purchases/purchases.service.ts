
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Purchase } from '@/models/purchases.model';
import { Supplier } from '@/models/suppliers.model';
import { PurchaseItem } from '@/models/purchase_items.model';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { COMPANY_ID } from '@/common/constants';


@Injectable()
export class PurchasesService {

  constructor(
    @InjectModel(Purchase)
    private readonly purchaseModel: typeof Purchase,

    @InjectModel(PurchaseItem)
    private readonly purchaseItemModel: typeof PurchaseItem,

    private readonly sequelize: Sequelize,
  ) { }

  // Calculate purchase item total
  private calculateItemTotal(item: any): number {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unit_price);
    const discount = Number(item.discount || 0);
    const tax = Number(item.tax || 0);

    if (
      !Number.isFinite(quantity) ||
      !Number.isFinite(unitPrice) ||
      quantity <= 0 ||
      unitPrice < 0 ||
      discount < 0 ||
      tax < 0
    ) {
      throw new BadRequestException('Invalid purchase item values');
    }

    const total = (quantity * unitPrice) - discount + tax;

    if (total < 0) {
      throw new BadRequestException('Purchase item total cannot be negative');
    }

    return Number(total.toFixed(2));
  }

  // CREATE PURCHASE
  async create(createPurchaseDto: CreatePurchaseDto) {

    const { items, ...purchaseData } = createPurchaseDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Purchase items are required');
    }

    return this.sequelize.transaction(async (transaction) => {

      let totalAmount = 0;

      const purchaseItems = items.map((item) => {
        const totalPrice = this.calculateItemTotal(item);

        totalAmount += totalPrice;

        return {
          inventory_item_id: item.inventory_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount || 0,
          tax: item.tax || 0,
          total_price: totalPrice,
        };
      });

      const purchase = await this.purchaseModel.create(
        {
          ...purchaseData,
          company_id: COMPANY_ID,
          purchase_date: new Date(createPurchaseDto.purchase_date),
          total_amount: Number(totalAmount.toFixed(2)),
          status: 'draft',
        },
        { transaction },
      );

      await this.purchaseItemModel.bulkCreate(
        purchaseItems.map((item) => ({
          ...item,
          purchase_id: purchase.id,
        })),
        { transaction },
      );

      return this.purchaseModel.findOne({
        where: {
          id: purchase.id
        },
        include: [
          {
            model: PurchaseItem,
            as: 'purchase_items',
          },
          {
            model: Supplier,
          },
        ],
        transaction,
      });
    });
  }

  // GET ALL PURCHASES
  async findAll() {

    return this.purchaseModel.findAll({
      include: [
        {
          model: PurchaseItem,
          as: 'purchase_items',
        },
        {
          model: Supplier,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // GET SINGLE PURCHASE
  async findOne(id: number) {

    const purchase = await this.purchaseModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: PurchaseItem,
          as: 'purchase_items',
        },
        {
          model: Supplier,
        },
      ],
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  // UPDATE PURCHASE
  async update(
    id: number,
    updatePurchaseDto: UpdatePurchaseDto,
  ) {

    return this.sequelize.transaction(async (transaction) => {

      const purchase = await this.purchaseModel.findOne({
        where: {
          id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!purchase) {
        throw new NotFoundException('Purchase not found');
      }

      if (purchase.status !== 'draft') {
        throw new BadRequestException(
          'Only draft purchases can be updated',
        );
      }

      const { items, ...purchaseData } =
        updatePurchaseDto;

      await purchase.update(
        {
          ...purchaseData,
          ...(purchaseData.purchase_date && {
            purchase_date: new Date(purchaseData.purchase_date),
          }),
          company_id: COMPANY_ID,
        },
        { transaction },
      );

      if (items !== undefined) {

        if (items.length === 0) {
          throw new BadRequestException(
            'Purchase must contain at least one item',
          );
        }

        await this.purchaseItemModel.destroy({
          where: {
            purchase_id: purchase.id,
          },
          transaction,
        });

        let totalAmount = 0;

        const purchaseItems = items.map((item) => {
          const totalPrice = this.calculateItemTotal(item);

          totalAmount += totalPrice;

          return {
            purchase_id: purchase.id,
            inventory_item_id: item.inventory_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount: item.discount || 0,
            tax: item.tax || 0,
            total_price: totalPrice,
          };
        });

        await this.purchaseItemModel.bulkCreate(
          purchaseItems,
          { transaction },
        );

        await purchase.update(
          {
            total_amount: Number(totalAmount.toFixed(2)),
          },
          { transaction },
        );
      }

      return this.purchaseModel.findOne({
        where: {
          id: purchase.id,
        },
        include: [
          {
            model: PurchaseItem,
            as: 'purchase_items',
          },
          {
            model: Supplier,
          },
        ],
        transaction,
      });
    });
  }

  // DELETE PURCHASE
  async remove(id: number) {

    return this.sequelize.transaction(async (transaction) => {

      const purchase = await this.purchaseModel.findOne({
        where: {
          id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!purchase) {
        throw new NotFoundException('Purchase not found');
      }

      if (purchase.status !== 'draft') {
        throw new BadRequestException(
          'Only draft purchases can be deleted',
        );
      }

      await this.purchaseItemModel.destroy({
        where: {
          purchase_id: purchase.id,
        },
        transaction,
      });

      await purchase.destroy({ transaction });

      return {
        message: 'Purchase deleted successfully',
      };
    });
  }
}
