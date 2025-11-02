import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './data-source.ts';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(options), UsersModule],
})
export class AppModule {}
