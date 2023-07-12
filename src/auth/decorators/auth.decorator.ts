import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ValidRoles } from '../enums/valid-roles.enum';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
    /* UseGuards(AuthGuard(), UserRoleGuard), FOR REGULAR API*/
  );
}
