import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginRequest } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

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

  async logout(user: LoginRequest): Promise<void> {
    const validUser = await this.validateUser(user.email, user.password);
    if (validUser) {
      // TODO
    }
  }
}
