import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
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

@Entity({ name: 'products' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Number, { nullable: true })
  stock: number;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  @Field(() => Number)
  price: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.product, { lazy: true })
  @Field(() => Category)
  category: Category;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  @Field(() => OrderDetail)
  orderDetail: OrderDetail[];

  @ManyToOne(() => User, (user) => user.product)
  user: User;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    lazy: true,
  })
  @Field(() => [ProductImage])
  images: ProductImage[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: Date;
}
