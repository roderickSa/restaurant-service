import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @Field(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock = 0;

  @Field(() => Number)
  @IsNumber()
  price: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive? = false;

  @Field(() => ID)
  @IsUUID()
  categoryId: string;
}
