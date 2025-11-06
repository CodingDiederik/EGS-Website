import { AuthController } from '../auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: any = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    authController = new AuthController(mockAuthService);
  });

  describe('login', () => {
    it('should set cookie and return success message on successful login', async () => {
      const req = { email: 'admin@example.com', password: 'adminpassword' };
      const res: any = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockAuthService.login = jest
        .fn()
        .mockResolvedValue({ access_token: 'token' });

      await authController.login(req, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(req);
      expect(res.cookie).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException on failed login', async () => {
      const req = { email: 'admin@example.com', password: 'wrongpassword' };
      const res: any = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockAuthService.login = jest.fn().mockReturnValue(null);

      await expect(authController.login(req, res)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('logout', () => {
    it('should clear cookie and return success message on logout', async () => {
      const req: any = { user: { sub: 1 } };
      const res: any = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockAuthService.logout = jest.fn().mockResolvedValue(undefined);

      expect(await authController.logout(req, res)).toEqual({
        message: 'Logout successful',
      });

      expect(mockAuthService.logout).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });
});
