import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../users.enum';

export class CreateUserRequest {
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @IsNotEmpty()
  role: UserRole;
}
