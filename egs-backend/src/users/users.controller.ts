import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserRole } from './users.enum';
import { UsersService } from './users.service';
import { CreateUserRequest, UpdateUserRequest } from './dto/users.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Gets all users.
   * @returns An array of Users.
   */
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  /**
   * Get a user.
   * @returns A User.
   */
  @Roles(UserRole.ADMIN)
  @Get(':userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return await this.usersService.getUser(userId);
  }

  /**
   * Creates a new user.
   * @returns The created User.
   */
  @Roles(UserRole.ADMIN)
  @Post()
  async createUser(@Body() userData: CreateUserRequest): Promise<User> {
    return await this.usersService.createUser(userData);
  }

  /**
   * Updates a user.
   * @returns The updated User.
   */
  @Roles(UserRole.ADMIN)
  @Patch(':userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() userData: UpdateUserRequest,
  ): Promise<User> {
    return await this.usersService.updateUser(userId, userData);
  }

  /**
   * Deletes a user.
   */
  @Roles(UserRole.ADMIN)
  @Delete(':userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.usersService.deleteUser(userId);
  }
}
