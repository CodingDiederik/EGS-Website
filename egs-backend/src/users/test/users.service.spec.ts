import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequest } from '../dto/create-user.dto';
import { UpdateUserRequest } from '../dto/update-user.dto';

type UsersRepository = Repository<User>;
let mockUsersRepository: Partial<UsersRepository>;

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    mockUsersRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    };
    usersService = new UsersService(mockUsersRepository as UsersRepository);
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [new User(), new User()];
      jest.spyOn(mockUsersRepository, 'find').mockResolvedValue(result);

      expect(await usersService.getAllUsers()).toBe(result);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser = new User();
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);

      expect(await usersService.getUser(userId)).toBe(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'johndoe@example.com';
      const mockUser = new User();
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);

      expect(await usersService.getUserByEmail(email)).toBe(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'StrongP@ssw0rd',
      };
      const mockUser = new User();
      jest.spyOn(mockUsersRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(mockUser);
      expect(await usersService.createUser(userData)).toBe(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const userId = 1;
      const userData: UpdateUserRequest = {
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: 'NewStr0ngP@ss',
      };
      const mockUser = new User();
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(mockUser);
      expect(await usersService.updateUser(userId, userData)).toBe(mockUser);
    });

    it('should throw an error if user not found', async () => {
      const userId = 999;
      const userData: UpdateUserRequest = {
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: 'NewStr0ngP@ss',
      };
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockRejectedValue(new Error('User not found'));
      await expect(usersService.updateUser(userId, userData)).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle empty update data', async () => {
      const userId = 1;
      const userData: UpdateUserRequest = {};
      const mockUser = new User();
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(mockUser);
      expect(await usersService.updateUser(userId, userData)).toBe(mockUser);
    });
  });

  describe('updateToken', () => {
    it('should update and return the user token', async () => {
      const userId = 1;
      const token = 'new-jwt-token';
      const mockUser = new User();
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(mockUser);
      expect(await usersService.updateToken(userId, token)).toBe(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should soft delete the user', async () => {
      const userId = 1;
      const mockUser = new User();
      mockUser.id = userId;
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockResolvedValue(mockUser);

      await usersService.deleteUser(userId);
      expect(mockUsersRepository.softRemove).toHaveBeenCalledWith(mockUser);
    });
    it('should handle non-existing user gracefully', async () => {
      const userId = 999;
      jest
        .spyOn(mockUsersRepository, 'findOneOrFail')
        .mockRejectedValue(new Error('User not found'));
      await expect(usersService.deleteUser(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
