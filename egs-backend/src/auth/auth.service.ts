import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginRequest } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await this.usersService.getUserByEmail(email);

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        }
      }
    } catch (error) {
      // user not found, return null
      this.logger.log('User validation failed: ' + error);
      return null;
    }
    return null;
  }

  /**
   * Handles user login
   * @param user the login request data
   * @returns the access token if login is successful, null otherwise
   */
  async login(user: LoginRequest): Promise<{ access_token: string } | null> {
    const validUser = await this.validateUser(user.email, user.password);

    if (validUser) {
      const payload: JwtPayload = {
        sub: validUser.id,
        email: validUser.email,
        role: validUser.role,
      };
      const token = await this.jwtService.signAsync(payload);

      await this.usersService.updateToken(validUser.id, token);
      return { access_token: token };
    }
    return null;
  }

  /**
   * Handles user logout
   * @param userid the ID of the user to log out
   */
  async logout(userid: number): Promise<void> {
    await this.usersService.updateToken(userid, '');
  }
}
