import { Controller, Body, Res, Post } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AUTH_COOKIE_NAME } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user login
   * @param req Login request data
   * @param res Response object
   * @returns Login success message
   */
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
        maxAge: 1000 * 60 * 60 * 1, // 1 hour
        path: '/',
      });
      return { message: 'Login successful' };
    }
  }
}
