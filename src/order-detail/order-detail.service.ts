import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailService {
  private readonly logger: Logger = new Logger('OrderDetailService');

  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async findOne(id: string): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailRepository.findOneBy({ id });

    if (!orderDetail) {
      throw new BadRequestException(`line order with id: ${id} doesn't exist`);
    }

    return orderDetail;
  }

  async findOrderDetailWithParentById(id: string): Promise<OrderDetail> {
    return await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .innerJoinAndSelect('orderDetail.order', 'order')
      .where('orderDetail.id = :id', { id })
      .getOne();
  }

  async update(updateOrderDetailInput: Partial<OrderDetail>): Promise<void> {
    await this.orderDetailRepository
      .createQueryBuilder()
      .update()
      .set(updateOrderDetailInput)
      .where('id = :id', { id: updateOrderDetailInput.id })
      .execute();
  }

  async remove(id: string): Promise<void> {
    await this.orderDetailRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('please check server logs');
  }
}
