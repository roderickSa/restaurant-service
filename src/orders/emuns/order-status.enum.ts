import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  pending = 'PENDING',
  canceled = 'CANCELLED',
  sent = 'SENT',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
