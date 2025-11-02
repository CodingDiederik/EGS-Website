import { PartialType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
