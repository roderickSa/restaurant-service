import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  providers: [ProductsResolver, ProductsService],
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
