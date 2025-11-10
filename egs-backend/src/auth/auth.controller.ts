import {
  Controller,
  Body,
  Res,
  Post,
  UnauthorizedException,
  Req,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/auth.dto';
import { JwtPayload } from './jwtPayload.interface';
import { Public } from '../common/decorators/public.decorator';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Handles user login
   * @param req Login request data
   * @param res Response object
   * @returns Login success message
   */
  @ApiForbiddenResponse({ description: 'Invalid credentials' })
  @ApiCreatedResponse({ description: 'Login successful' })
  @Public()
  @Post('login')
  async login(
    @Body() req: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req);

    if (token) {
      res.cookie(AUTH_COOKIE_NAME, token.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 60 * 60 * 1000, // 10 hours
        path: '/',
      });
      return { message: 'Login successful' };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Handles user logout
   * @param res Response object
   * @returns Logout success message
   */
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = request.user as JwtPayload;

    request['user'] = payload;

    await this.authService.logout(payload.sub);
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Logout successful' };
  }

  /**
   * Retrieves information about the currently authenticated user
   * @param request Request object
   * @returns User
   */
  @Get('me')
  async me(@Req() request: Request): Promise<User> {
    const payload = request.user as JwtPayload;
    return await this.usersService.getUser(payload.sub);
  }
}
