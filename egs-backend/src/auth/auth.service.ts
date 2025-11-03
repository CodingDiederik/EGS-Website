import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/auth.dto';

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

  login(user: LoginRequest) {
    const payload = { email: user.email, date: Date.now() };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }
}
