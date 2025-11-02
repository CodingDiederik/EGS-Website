import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config({
  quiet: true,
});

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  password:
    process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'egs',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true' || false,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};
