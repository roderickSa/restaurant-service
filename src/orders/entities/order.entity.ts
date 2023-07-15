import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../emuns/order-status.enum';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';

@Entity({ name: 'orders' })
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  @Field(() => Number)
  amount: number;

  @ManyToOne(() => User, (user) => user.order, { lazy: true })
  @Field(() => User)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    eager: true,
    cascade: true,
  })
  @Field(() => [OrderDetail])
  orderDetail: OrderDetail[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: Date;
}
