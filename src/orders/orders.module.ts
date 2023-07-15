import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetailModule } from 'src/order-detail/order-detail.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [OrdersResolver, OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule,
    ProductsModule,
    OrderDetailModule,
  ],
  exports: [TypeOrmModule, OrdersService],
})
export class OrdersModule {}
