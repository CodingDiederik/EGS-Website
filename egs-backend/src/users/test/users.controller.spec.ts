import { UsersController } from '../users.controller';
import { CreateUserRequest } from '../dto/create-user.dto';
import { UpdateUserRequest } from '../dto/update-user.dto';
import { UserRole } from '../users.enum';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: any = {
    getAllUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(() => {
    usersController = new UsersController(mockUsersService);
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe' }];
      mockUsersService.getAllUsers.mockResolvedValue(mockUsers);

      const result = await usersController.getAllUsers();
      expect(result).toBe(mockUsers);
      expect(mockUsersService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, name: 'John Doe' };
      mockUsersService.getUser.mockResolvedValue(mockUser);

      const result = await usersController.getUser(userId);
      expect(result).toBe(mockUser);
      expect(mockUsersService.getUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const mockUserData: CreateUserRequest = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'StrongP@ssw0rd',
        role: UserRole.USER,
      };
      const mockCreatedUser = { id: 2, ...mockUserData };
      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);

      const result = await usersController.createUser(mockUserData);
      expect(result).toBe(mockCreatedUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const userId = 1;
      const mockUserData: UpdateUserRequest = { email: 'johndoe@example.com' };
      const mockUpdatedUser = {
        id: userId,
        name: 'johndoe',
        email: 'johndoe@example.com',
        role: UserRole.USER,
      };
      mockUsersService.updateUser.mockResolvedValue(mockUpdatedUser);

      const result = await usersController.updateUser(userId, mockUserData);
      expect(result).toBe(mockUpdatedUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(
        userId,
        mockUserData,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const result = await usersController.deleteUser(userId);
      expect(result).toBeUndefined();
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });
});
