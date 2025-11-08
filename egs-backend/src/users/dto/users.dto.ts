import { PartialType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

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
}

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
