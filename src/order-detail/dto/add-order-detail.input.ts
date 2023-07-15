import { InputType, Field, ID } from '@nestjs/graphql';
import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

@InputType()
export class AddOrderDetailInput {
  @Field(() => Number)
  @IsNumber()
  @Min(1)
  @IsInt()
  quantity: number;

  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field(() => ID)
  @IsUUID()
  orderId: string;
}
