import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderDetailInput } from 'src/order-detail/dto/create-order-detail.input';

@InputType()
export class CreateOrderDetailInputArr {
  @Field(() => [CreateOrderDetailInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailInput)
  orderDetail: CreateOrderDetailInput[];
}
