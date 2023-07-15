import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDetailInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Number)
  @IsNumber()
  @Min(1)
  @IsInt()
  quantity: number;
}
