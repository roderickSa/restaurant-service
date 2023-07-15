import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { OrderStatus } from './emuns/order-status.enum';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDetailInputArr } from './dto/create-order.input';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { UsersService } from 'src/users/users.service';
import { AddOrderDetailInput } from 'src/order-detail/dto/add-order-detail.input';
import { OrderDetailService } from 'src/order-detail/order-detail.service';
import { UpdateOrderDetailInput } from 'src/order-detail/dto/update-order-detail.input';

@Injectable()
export class OrdersService {
  private readonly logger: Logger = new Logger('OrderService');

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly orderDetailService: OrderDetailService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createOrderDetailInputArr: CreateOrderDetailInputArr,
    user: User,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let amount = 0;
    //PREPARE ORDER ITEMS
    const orderDetailValidatedPromise =
      createOrderDetailInputArr.orderDetail.map(
        async ({ productId, ...rest }) => {
          const { price } = await this.productsService.findOne(productId);
          const unit_amount = price * rest.quantity;
          amount += unit_amount;

          return {
            ...rest,
            price,
            unit_amount,
            picked_up: false,
            s_quantity: 0,
            product: { id: productId },
          };
        },
      );

    const orderDetailValidated = await Promise.all(orderDetailValidatedPromise);

    try {
      //CREATE ORDER
      const orderInstance = this.orderRepository.create({
        amount,
        status: OrderStatus.pending,
        user,
      });
      const order = await queryRunner.manager.save(orderInstance);

      //BUILD AND CREATE ORDER ITEMS
      const orderDetail = orderDetailValidated.map((product) => {
        return queryRunner.manager.create(OrderDetail, {
          ...product,
          order: { id: order.id },
        });
      });
      await queryRunner.manager.save(orderDetail);

      await queryRunner.commitTransaction();
      return await this.findOne(order.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.ErrorHandler(error);
    } finally {
      await queryRunner.release();
    }
  }

  async addOrderDetailToOrder(
    addOrderDetailInput: AddOrderDetailInput,
  ): Promise<Order> {
    const { orderId, productId, quantity } = addOrderDetailInput;

    const order = await this.findOne(orderId);
    const { price } = await this.productsService.findOne(productId);

    const unit_amount = price * quantity;
    const current_amount = order.orderDetail.reduce(
      (acc, item) => acc + +item.unit_amount,
      0,
    );
    order.amount = current_amount + unit_amount;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderDetail = queryRunner.manager.create(OrderDetail, {
        unit_amount,
        quantity,
        price,
        picked_up: false,
        s_quantity: 0,
        product: { id: productId },
        order: { id: orderId },
      });

      await queryRunner.manager.save(order);
      await queryRunner.manager.save(orderDetail);

      await queryRunner.commitTransaction();
      return await this.findOne(order.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.ErrorHandler(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderDetailToOrder(
    updateOrderDetailInput: UpdateOrderDetailInput,
  ): Promise<Order> {
    const { id: orderDetailId, quantity } = updateOrderDetailInput;
    //FIND DETAIL
    const orderDetail =
      await this.orderDetailService.findOrderDetailWithParentById(
        orderDetailId,
      );

    if (!orderDetail) {
      throw new BadRequestException(
        `line order with id: ${orderDetailId} doesn't exist`,
      );
    }

    //SET DETAIL FIELDS
    const unit_amount = orderDetail.price * quantity;
    const setParams: Partial<OrderDetail> = {
      ...updateOrderDetailInput,
      unit_amount,
    };

    try {
      //UPDATE DETAIL
      await this.orderDetailService.update(setParams);

      //FIND AND UPDATE ORDER
      const orderId = orderDetail.order.id;
      const order = await this.findOne(orderId);
      const current_amount = order.orderDetail.reduce(
        (acc, item) => acc + +item.unit_amount,
        0,
      );
      order.amount = current_amount;
      await this.orderRepository.save(order);

      return order;
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async removeOrderDetailToOrder(orderDetailId: string): Promise<Order> {
    const orderDetail =
      await this.orderDetailService.findOrderDetailWithParentById(
        orderDetailId,
      );

    if (!orderDetail) {
      throw new BadRequestException(
        `line order with id: ${orderDetailId} doesn't exist`,
      );
    }

    const orderId = orderDetail.order.id;
    await this.orderDetailService.remove(orderDetailId);
    const order = await this.findOne(orderId);

    const current_amount = order.orderDetail.reduce(
      (acc, item) => acc + +item.unit_amount,
      0,
    );
    order.amount = current_amount;

    await this.orderRepository.save(order);
    return order;
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Order[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    return await this.orderRepository.find({
      take: limit,
      skip: offset,
      where: {
        user: { email: ILike(`%${search}%`) },
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new BadRequestException(`order with id: ${id} doesn't exist`);
    }

    return order;
  }

  async updateOrder(
    id: string,
    updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    const { userId, ...rest } = updateOrderInput;
    await this.findOne(id);

    let setParams: any = rest;
    if (userId) {
      await this.usersService.findOne(userId);
      setParams = { ...setParams, user: { id: userId } };
    }

    try {
      await this.orderRepository
        .createQueryBuilder()
        .update()
        .set(setParams)
        .where('id = :id', { id })
        .execute();

      return await this.findOne(id);
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.findOne(id);

    order.status = OrderStatus.canceled;
    await this.orderRepository.save(order);

    return order;
  }

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('please check server logs');
  }
}
