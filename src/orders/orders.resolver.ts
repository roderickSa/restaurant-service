import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UpdateOrderInput } from './dto/update-order.input';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { CreateOrderDetailInputArr } from './dto/create-order.input';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { AddOrderDetailInput } from 'src/order-detail/dto/add-order-detail.input';
import { UpdateOrderDetailInput } from 'src/order-detail/dto/update-order-detail.input';

@Auth(ValidRoles.admin)
@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order, { name: 'order' })
  async createOrder(
    @Args('createOrderDetailInputArr')
    createOrderDetailInputArr: CreateOrderDetailInputArr,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDetailInputArr, user);
  }

  @Mutation(() => Order, { name: 'addOrderDetailToOrder' })
  async addOrderDetailToOrder(
    @Args('addOrderDetailInput')
    addOrderDetailInput: AddOrderDetailInput,
  ): Promise<Order> {
    return this.ordersService.addOrderDetailToOrder(addOrderDetailInput);
  }

  @Mutation(() => Order, { name: 'updateOrderDetailToOrder' })
  async updateOrderDetailToOrder(
    @Args('updateOrderDetailInput')
    updateOrderDetailInput: UpdateOrderDetailInput,
  ): Promise<Order> {
    return this.ordersService.updateOrderDetailToOrder(updateOrderDetailInput);
  }

  @Mutation(() => Order, { name: 'removeOrderDetailToOrder' })
  async removeOrderDetailToOrder(
    @Args('orderDetailId', { type: () => ID }, ParseUUIDPipe)
    orderDetailId: string,
  ): Promise<Order> {
    return this.ordersService.removeOrderDetailToOrder(orderDetailId);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Order[]> {
    return this.ordersService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Order, { name: 'order' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    return this.ordersService.updateOrder(
      updateOrderInput.id,
      updateOrderInput,
    );
  }

  @Mutation(() => Order)
  async cancelOrder(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(id);
  }
}
