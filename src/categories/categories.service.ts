import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryInput);
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.ErrorHandler(error);
    }
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Category[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.categoryRepository
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

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new BadRequestException(`category with id ${id} doesn't exists`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryInput,
    });

    if (!category) {
      throw new BadRequestException(`categoty with id ${id} doesn't exists`);
    }

    return await this.categoryRepository.save(category);
  }

  /* async remove(id: string): Promise<Category> {
    const category = await this.findOne(id);

    await this.categoryRepository.delete(category);

    return category;
  } */

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('please check server logs');
  }
}
