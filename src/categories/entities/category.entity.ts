import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category, { lazy: true })
  @Field(() => Product)
  product: Product[];
}
