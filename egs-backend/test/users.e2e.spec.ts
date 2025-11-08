import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { DomainErrorFilter } from '../src/common/filters/domainError.filter';
import { EntityNotFoundErrorFilter } from '../src/common/filters/notFound.filter';
import { DataSource } from 'typeorm';
import { runseeds } from '../src/seeds/seed';
import { AuthGuard } from '../src/auth/guard/auth.guard';
import { MockAuthGuard } from './mockAuthGuard';

describe('Users E2E Test', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(
      new DomainErrorFilter(),
      new EntityNotFoundErrorFilter(),
    );

    const orm: DataSource = app.get(DataSource);

    if (!orm.isInitialized) {
      await orm.initialize();
    }

    // remove all data from the database before each test
    await orm.synchronize(true);

    await runseeds(orm);

    await app.init();
  });

  it('/users/getAllUsers (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/users/:userId (GET)', async () => {
    // get a user already created from seeds
    const allusersresponse = await request(app.getHttpServer()).get('/users');

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const response = await request(app.getHttpServer()).get(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(userId);
  });

  it('/users/:userId (GET) - fail', async () => {
    const response = await request(app.getHttpServer()).get('/users/999');

    expect(response.status).toBe(404);
  });

  it('/users/:userId (PATCH) - success', async () => {
    // update a user already created from seeds
    const allusersresponse = await request(app.getHttpServer()).get('/users');

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const updatedData = {
      password: 'updatedpassword',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
  });

  it('/users/:userId (DELETE) - success', async () => {
    // delete a user created from seeds
    const allusersresponse = await request(app.getHttpServer()).get('/users');

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const response = await request(app.getHttpServer()).delete(
      `/users/${userId}`,
    );

    expect(response.status).toBe(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
