import { DataSource } from 'typeorm';
import UserSeeder from './users.seeder';

export async function runseeds(dataSource: DataSource) {
  const seeders = [new UserSeeder()];

  for (const seeder of seeders) {
    await seeder.run(dataSource);
  }
}
