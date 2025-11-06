import { AuthGuard } from '../guard/auth.guard';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { UserRole } from '../../users/users.enum';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockJWTService: any = {
    verifyAsync: jest.fn(),
  };
  let mockReflector: any = {
    getAllAndOverride: jest.fn(),
  };
  let mockUsersService: any = {
    getUser: jest.fn(),
  };

  beforeEach(async () => {
    authGuard = new AuthGuard(mockJWTService, mockReflector, mockUsersService);
  });

  it('should always allow access to public routes', async () => {
    jest.spyOn(mockReflector, 'getAllAndOverride').mockReturnValue(true);

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ cookies: {} }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access when no token is present', async () => {
    jest.spyOn(mockReflector, 'getAllAndOverride').mockReturnValue(false);

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ cookies: {} }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should deny access when token verification fails', async () => {
    jest.spyOn(mockReflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(mockJWTService, 'verifyAsync')
      .mockRejectedValue(new Error('invalid token'));

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { [AUTH_COOKIE_NAME]: 'invalid-token' },
        }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(mockJWTService.verifyAsync).toHaveBeenCalledWith('invalid-token');
    expect(result).toBe(false);
  });

  it('should deny access when user role is insufficient', async () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockImplementation((key: string) => {
        if (key === 'isPublic') return false;
        if (key === 'roles') return [UserRole.ADMIN];
      });
    jest
      .spyOn(mockJWTService, 'verifyAsync')
      .mockResolvedValue({ sub: '1', role: UserRole.USER });

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ cookies: { [AUTH_COOKIE_NAME]: 'valid-token' } }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(mockJWTService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(result).toBe(false);
  });

  it('should deny access when user token does not match', async () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockImplementation((key: string) => {
        if (key === 'isPublic') return false;
        if (key === 'roles') return [UserRole.USER];
      });
    jest
      .spyOn(mockJWTService, 'verifyAsync')
      .mockResolvedValue({ sub: '1', role: UserRole.ADMIN });
    jest
      .spyOn(mockUsersService, 'getUser')
      .mockResolvedValue({ [AUTH_COOKIE_NAME]: 'valid-token' });

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ cookies: { [AUTH_COOKIE_NAME]: 'valid-token' } }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(result).toBe(false);
    expect(mockUsersService.getUser).toHaveBeenCalledWith(1);
    expect(mockJWTService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('should allow access when all checks pass', async () => {
    jest
      .spyOn(mockReflector, 'getAllAndOverride')
      .mockImplementation((key: string) => {
        if (key === 'isPublic') return false;
        if (key === 'roles') return [UserRole.USER];
      });
    jest
      .spyOn(mockJWTService, 'verifyAsync')
      .mockResolvedValue({ sub: '1', role: UserRole.USER });
    jest
      .spyOn(mockUsersService, 'getUser')
      .mockResolvedValue({ JTI: 'valid-token' });

    const context: any = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ cookies: { [AUTH_COOKIE_NAME]: 'valid-token' } }),
      }),
    };

    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
