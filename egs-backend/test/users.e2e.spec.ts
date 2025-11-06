import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AUTH_COOKIE_NAME } from '../src/auth/auth.constants';
import cookieParser from 'cookie-parser';
import { DomainErrorFilter } from '../src/common/filters/domainError.filter';
import { EntityNotFoundErrorFilter } from '../src/common/filters/notFound.filter';
import { DataSource } from 'typeorm';
import { runseeds } from '../src/seeds/seed';

describe('Users E2E Test', () => {
  let app: INestApplication<App>;
  let cookie: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    await runseeds(orm);

    await orm.runMigrations();

    await app.init();

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

    cookie = raw.split(';')[0].trim();
  });

  it('/users/getAllUsers (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/users/:userId (GET)', async () => {
    // get a user already created from seeds
    const allusersresponse = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', cookie);

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(userId);
  });

  it('/users/:userId (GET) - fail', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/999')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);
  });

  it('/users/:userId (PATCH) - success', async () => {
    // update a user already created from seeds
    const allusersresponse = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', cookie);

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const updatedData = {
      password: 'updatedpassword',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updatedData)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
  });

  it('/users/:userId (DELETE) - success', async () => {
    // delete a user created from seeds
    const allusersresponse = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', cookie);

    expect(allusersresponse.status).toBe(200);
    expect(Array.isArray(allusersresponse.body)).toBe(true);
    expect(allusersresponse.body.length).toBeGreaterThan(0);

    const userId = allusersresponse.body[0].id;

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
  });

  afterEach(async () => {
    // logout
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookie);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Logout successful');
    await app.close();
  });
});
