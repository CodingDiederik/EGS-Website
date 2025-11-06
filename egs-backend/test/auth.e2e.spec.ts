import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AUTH_COOKIE_NAME } from '../src/auth/auth.constants';
import cookieParser from 'cookie-parser';
import { DataSource, getConnection } from 'typeorm';
import { runseeds } from '../src/seeds/seed';

describe('Auth E2E Test', () => {
  let app: INestApplication<App>;
  let orm: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    orm = app.get(DataSource);
    
    if (!orm.isInitialized) {
      await orm.initialize();
    }

    // Fetch all the entities
    const entities = orm.entityMetadatas;
    
    // Clear each entity table's content
    for (const entity of entities) {
      const repository = orm.getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }
    
    await runseeds(orm);
    
    await orm.runMigrations();
    await app.init();
  });

  it('/auth/login (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin@example.com', password: 'wrongpassword' })
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
      });
  });

  it('/auth/login (POST) and /auth/logout (POST) - success', async () => {
    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpassword' });

    expect(response.status).toBe(201);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toMatch(
      new RegExp(`${AUTH_COOKIE_NAME}=.+`),
    );

    const raw = response.headers['set-cookie']?.[0];
    expect(raw).toBeDefined();
    expect(raw).toMatch(new RegExp(`${AUTH_COOKIE_NAME}=`));

    const cookie = raw.split(';')[0].trim();

    response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookie);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Logout successful');
  });

  it('/auth/logout (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .expect(403)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Forbidden resource');
      });
  });

  afterEach(async () => {
    // Fetch all the entities
    const entities = orm.entityMetadatas;
    
    // Clear each entity table's content
    for (const entity of entities) {
      const repository = orm.getRepository(entity.name); // Get repository
      await repository.clear(); // Clear each entity table's content
    }

    await app.close();
  });
});
