import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    user: User,
  ): Promise<Product> {
    const { categoryId, ...rest } = createProductInput;
    await this.categoryService.findOne(categoryId);

    try {
      const newProduct = this.productRepository.create({
        ...rest,
        user: { id: user.id },
        category: { id: categoryId },
      });
      await this.productRepository.save(newProduct);

      return await this.findOne(newProduct.id);
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Product[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.productRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLocaleLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new BadRequestException(`product with id: ${id} doesn't exist`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const { categoryId, ...rest } = updateProductInput;
    await this.findOne(id);

    let setParams: any = rest;
    if (categoryId) {
      await this.categoryService.findOne(categoryId);
      setParams = { ...setParams, category: { id: categoryId } };
    }
    try {
      const queryBuilder = this.productRepository
        .createQueryBuilder()
        .update()
        .set(setParams)
        .where('id = :id', { id });

      await queryBuilder.execute();

      return await this.findOne(id);
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async deactivateProduct(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.isActive = false;

    await this.productRepository.save(product);

    return product;
  }

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('please check server logs');
  }
}
