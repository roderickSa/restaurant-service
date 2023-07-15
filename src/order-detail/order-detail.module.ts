import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailResolver } from './order-detail.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [OrderDetailResolver, OrderDetailService],
  imports: [TypeOrmModule.forFeature([OrderDetail]), ProductsModule],
  exports: [TypeOrmModule, OrderDetailService],
})
export class OrderDetailModule {}
