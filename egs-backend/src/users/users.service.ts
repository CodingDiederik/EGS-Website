import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest, UpdateUserRequest } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

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
   * Get user by ID.
   * @param userId ID of the user to retrieve.
   * @returns A User.
   */
  async getUser(userId: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
  }

  /**
   * Get user by email.
   * @param email Email of the user to retrieve.
   * @returns A User.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    newUser.hashedPassword = hashedPassword;

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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      user.hashedPassword = hashedPassword;
    }
    return await this.userRepository.save(user);
  }

  /**
   * Updates the JWT token for a user.
   * @param userId - ID of the user to update.
   * @param token - New JWT token.
   * @returns The updated User.
   */
  async updateToken(userId: number, token: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    user.JTI = token;
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
