import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductsModule } from 'src/products/products.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    ProductsModule,
    CloudinaryModule,
  ],
  exports: [TypeOrmModule, ProductImagesService],
})
export class ProductImagesModule {}
