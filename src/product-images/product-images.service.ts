import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductImage } from './entities/product-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductsService } from 'src/products/products.service';
import { RemoveProductImageDtoArr } from './dto/remove-product-image.dto';

@Injectable()
export class ProductImagesService {
  private readonly logger = new Logger('ProductImagesService');
  private readonly RESTAURANT_SERVICE_PRODUCTS = 'RESTAURANT_SERVICE_PRODUCTS';

  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async updateImages(
    productId: string,
    files: Express.Multer.File[],
  ): Promise<ProductImage[]> {
    if (!files) {
      throw new BadRequestException(`images don't found`);
    }

    await this.productsService.findOne(productId);
    const cloudyResponse = await this.uploadFile(files);
    try {
      const productImages = cloudyResponse.map(({ secure_url, public_id }) =>
        this.productImageRepository.create({
          url: secure_url,
          external_id: public_id,
          product: { id: productId },
        }),
      );
      await this.productImageRepository.save(productImages);

      return productImages;
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async removeImages(
    removeProductImageDtoArr: RemoveProductImageDtoArr,
  ): Promise<void> {
    const promiseProductImages = removeProductImageDtoArr.objects.map(
      async ({ productImageId }) => {
        return await this.findOne(productImageId);
      },
    );
    const productImages = await Promise.all(promiseProductImages);
    const productImages_ids = productImages.map(({ id }) => id);
    const public_ids = productImages.map(({ external_id }) => external_id);

    await this.deleteFile(public_ids);

    try {
      await this.productImageRepository
        .createQueryBuilder()
        .delete()
        .where('id IN (:...id)', { id: productImages_ids })
        .execute();
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<ProductImage> {
    const productImage = await this.productImageRepository.findOneBy({ id });

    if (!productImage) {
      throw new BadRequestException(
        `image of product with id: ${id} doesn't exist`,
      );
    }

    return productImage;
  }

  async uploadFile(files: Express.Multer.File[]) {
    return await this.cloudinaryService
      .uploadImage(files, this.RESTAURANT_SERVICE_PRODUCTS)
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException('error during upload images');
      });
  }

  async deleteFile(public_ids: string[]) {
    return await this.cloudinaryService
      .deleteImage(public_ids)
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException('error during delete images');
      });
  }

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('please check server logs');
  }
}
