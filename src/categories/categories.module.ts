import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CategoriesResolver, CategoriesService],
  imports: [AuthModule, TypeOrmModule.forFeature([Category])],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule {}
