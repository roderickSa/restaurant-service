import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Auth(ValidRoles.admin)
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @GetUser() user: User,
  ): Promise<Product> {
    return this.productsService.create(createProductInput, user);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Product[]> {
    return this.productsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Product, { name: 'product' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation(() => Product)
  async deactivateProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.deactivateProduct(id);
  }
}
