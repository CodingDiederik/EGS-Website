import { Controller, Request, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() req: LoginRequest) {
    return this.authService.login(req);
  }
}
