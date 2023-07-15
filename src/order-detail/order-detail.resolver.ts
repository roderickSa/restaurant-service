import { Resolver } from '@nestjs/graphql';
import { OrderDetail } from './entities/order-detail.entity';

@Resolver(() => OrderDetail)
export class OrderDetailResolver {}
