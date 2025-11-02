import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateUserRequest {

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UpdateUserRequest extends PartialType(CreateUserRequest) {
}
