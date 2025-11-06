import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainError extends HttpException {
  constructor() {
    super('Domain Error', HttpStatus.BAD_REQUEST);
  }
}
