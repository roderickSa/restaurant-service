import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_images' })
@ObjectType()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({
    default: null,
  })
  @Field(() => String, { nullable: true })
  external_id: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @Field(() => Product)
  product: Product;
}
