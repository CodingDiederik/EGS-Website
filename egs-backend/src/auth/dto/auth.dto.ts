import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../../users/users.enum';

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
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
