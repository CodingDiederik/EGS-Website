import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Migrations E2E Test', () => {
  let app: INestApplication;
  let orm: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    orm = app.get(DataSource);

    if (!orm.isInitialized) {
      await orm.initialize();
    }

    // Drop and recreate schema to simulate a clean state
    await orm.dropDatabase();

    await app.init();
  });

  it('should run migrations successfully', async () => {
    // Run pending migrations
    await orm.runMigrations()
        .then(() => {
            expect(true).toBe(true); // If migrations run without error, the test passes
        });
  });

  afterEach(async () => {
    await app.close();
  });
});