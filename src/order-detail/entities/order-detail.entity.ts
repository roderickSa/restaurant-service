import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'orderDetail' })
@Unique('orderDetail-row', ['order', 'product'])
@ObjectType()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  picked_up: boolean;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  s_quantity: number;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  @Field(() => Number)
  price: number;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  @Field(() => Number)
  unit_amount: number;

  @ManyToOne(() => Order, (order) => order.orderDetail, { onDelete: 'CASCADE' })
  @Field(() => Order)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetail, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field(() => Product)
  product: Product;
}
