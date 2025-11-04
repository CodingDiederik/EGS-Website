import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from '../dto/auth.dto';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/user.entity';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic == true) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = (request.cookies as { [AUTH_COOKIE_NAME]?: string })?.[AUTH_COOKIE_NAME];

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request['user'] = payload;

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = payload.role;

        const hasRole = requiredRoles.some(
          (role: UserRole) => userRole === role,
        );
        if (!hasRole) {
          return false;
        }
      }

      const user = await this.usersService.getUser(payload.sub);
      if (!user || user.JTI !== token) {
        return false;
      }

    } catch {
      return false;
    }

    return true;
  }
}
