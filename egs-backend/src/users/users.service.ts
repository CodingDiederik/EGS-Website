import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest, UpdateUserRequest } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Gets all users.
   * @returns An array of Users.
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Creates a new user.
   * @param userData - Data for the new user.
   * @returns The created User.
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    const newUser = new User();
    newUser.email = userData.email;
    newUser.name = userData.username;
    newUser.hashedPassword = userData.password; // TODO: Hash password
    return await this.userRepository.save(newUser);
  }

  /**
   * Updates a user.
   * @param userId - ID of the user to update.
   * @param userData - Updated data for the user.
   * @returns The updated User.
   */
  async updateUser(userId: number, userData: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    if (userData.email) {
      user.email = userData.email;
    }
    if (userData.username) {
      user.name = userData.username;
    }
    if (userData.password) {
      user.hashedPassword = userData.password; // TODO: Hash password
    }
    return await this.userRepository.save(user);
  }

  /**
   * Deletes a user.
   * @param userId - ID of the user to delete.
   */
  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });

    await this.userRepository.softRemove(user);
  }
}
