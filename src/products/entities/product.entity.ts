import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => User, (category) => category.product)
  user: User;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: Date;
}