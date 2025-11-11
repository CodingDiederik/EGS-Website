import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from '../jwtPayload.interface';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/users.enum';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // always allow access to public routes
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = (request.cookies as { [AUTH_COOKIE_NAME]?: string })?.[
      AUTH_COOKIE_NAME
    ];

    if (!token) {
      return false;
    }

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request['user'] = payload;

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles && requiredRoles.length > 0) {
        // Check user roles
        const userRole = payload.role;

        const hasRole = requiredRoles.includes(userRole);
        if (!hasRole && userRole !== UserRole.ADMIN) {
          return false;
        }
      }

      // Verify token against user's token
      const user = await this.usersService.getUser(Number(payload.sub));
      if (user?.JTI !== token) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }
}
