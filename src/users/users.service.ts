import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SigninInput } from 'src/auth/dto/signin.input';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class UsersService {
  private readonly SALT_JWT = 10;
  private readonly logger: Logger = new Logger('UserService');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signinInput: SigninInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signinInput,
        password: bcrypt.hashSync(signinInput.password, this.SALT_JWT),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);
      this.ErrorHandler(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(`${email} do not found`);
    }
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('LOWER(email) like :email', {
        email: `%${search.toLocaleLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`user with id ${id} doesn't exists`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const userUpdated = await this.userRepository.preload({
      id,
      ...updateUserInput,
    });

    if (!userUpdated) {
      throw new BadRequestException(`user with id: ${id} doesn't exist`);
    }

    try {
      return await this.userRepository.save(userUpdated);
    } catch (error) {
      this.logger.error(error);
      this.ErrorHandler(error);
    }
  }

  async blockUser(id: string): Promise<User> {
    const user = await this.findOne(id);

    user.isActive = false;

    return await this.userRepository.save(user);
  }

  private ErrorHandler(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('please check server logs');
  }
}
