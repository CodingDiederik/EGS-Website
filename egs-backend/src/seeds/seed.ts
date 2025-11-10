import { DataSource } from 'typeorm';
import UserSeeder from './users.seeder';
import ArticleSeeder from './articles.seeder';

export async function runseeds(dataSource: DataSource) {
  const seeders = [new UserSeeder(), new ArticleSeeder()];

  for (const seeder of seeders) {
    await seeder.run(dataSource);
  }
}
