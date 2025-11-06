import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { LoginRequest } from '../dto/auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: any = {
    getUserByEmail: jest.fn(),
    updateToken: jest.fn(),
  };
  let mockJWTService: any = {
    signAsync: jest.fn().mockResolvedValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    authService = new AuthService(mockUserService, mockJWTService);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        hashedPassword: await bcrypt.hash('password123', 10),
        role: 'user',
      };

      jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(mockUser);

      const result = await authService['validateUser'](
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(null);

      const result = await authService['validateUser'](
        'test@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const result = await authService['validateUser'](
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if login is successful', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        hashedPassword: await bcrypt.hash('password123', 10),
        role: 'user',
      };

      jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(mockUserService, 'updateToken').mockResolvedValue(undefined);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      } as LoginRequest);

      expect(result).toEqual({ access_token: expect.any(String) });
    });

    it('should return null if login fails', async () => {
      jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(null);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      } as LoginRequest);

      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call updateToken with empty string', async () => {
      jest.spyOn(mockUserService, 'updateToken').mockResolvedValue(undefined);

      await authService.logout(1);

      expect(mockUserService.updateToken).toHaveBeenCalledWith(1, '');
    });
  });
});
