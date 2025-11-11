import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // set the user object in the request to simulate an authenticated admin user
    const request = context.switchToHttp().getRequest();
    const user = { id: 9999, email: 'admin@example.com', role: 'admin' };
    request.user = user;
    return user?.role === 'admin';
  }
}
