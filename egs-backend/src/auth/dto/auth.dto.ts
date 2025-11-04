import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export class LoginRequest {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'adminpassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
