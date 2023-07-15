import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../emuns/order-status.enum';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsString()
  @IsOptional()
  status?: OrderStatus;
}
