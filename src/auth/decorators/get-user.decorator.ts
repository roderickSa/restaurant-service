import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req?.user;

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    if (data) {
      return user[data] || '';
    }

    return user;
  },
);
