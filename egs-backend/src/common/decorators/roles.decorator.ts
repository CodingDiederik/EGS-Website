import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/users.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
