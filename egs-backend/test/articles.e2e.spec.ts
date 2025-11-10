import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { EntityNotFoundErrorFilter } from '../src/common/filters/notFound.filter';
import { DataSource } from 'typeorm';
import { runseeds } from '../src/seeds/seed';
import { AuthGuard } from '../src/auth/guard/auth.guard';
import { MockAuthGuard } from './mockAuthGuard';
import { CreateArticleRequest } from '../src/articles/dto/create-article.dto';
import { UpdateArticleRequest } from '../src/articles/dto/update-article.dto';

describe('Articles E2E Test', () => {
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

    app.useGlobalFilters(new EntityNotFoundErrorFilter());

    const orm: DataSource = app.get(DataSource);

    if (!orm.isInitialized) {
      await orm.initialize();
    }

    // remove all data from the database before each test
    await orm.synchronize(true);

    await runseeds(orm);

    await app.init();
  });

  it('/articles/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/articles');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/articles/ (POST)', async () => {
    const newArticle: CreateArticleRequest = {
      title: 'Integration Test Article',
      content: 'This article was created during e2e tests.',
      publicAuthor: 'E2E Tester',
    };

    const response = await request(app.getHttpServer())
      .post('/articles')
      .send(newArticle);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('/articles/:articleId (GET)', async () => {
    // get a published article (from seeds)
    const allResponse = await request(app.getHttpServer()).get('/articles');

    expect(allResponse.status).toBe(200);
    expect(Array.isArray(allResponse.body)).toBe(true);
    expect(allResponse.body.length).toBeGreaterThan(0);

    const articleId = allResponse.body[0].id;

    const response = await request(app.getHttpServer()).get(
      `/articles/${articleId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(articleId);
  });

  it('/articles/:articleId (GET) - not found', async () => {
    const response = await request(app.getHttpServer()).get('/articles/999');

    expect(response.status).toBe(404);
  });

  it('/articles/unpublished (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/articles/unpublished',
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('/articles/unpublished/:articleId (GET)', async () => {
    // get an unpublished article from seeds
    const allUnpublished = await request(app.getHttpServer()).get(
      '/articles/unpublished',
    );

    expect(allUnpublished.status).toBe(200);
    expect(Array.isArray(allUnpublished.body)).toBe(true);

    if (allUnpublished.body.length === 0) {
      // if none unpublished, create one and then fetch
      const created = await request(app.getHttpServer())
        .post('/articles')
        .send({
          title: 'Temp Unpublished',
          content: 'Temp',
          publicAuthor: 'E2E',
        });
      expect(created.status).toBe(201);
      const id = created.body.id;
      const response = await request(app.getHttpServer()).get(
        `/articles/unpublished/${id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(id);
    } else {
      const id = allUnpublished.body[0].id;
      const response = await request(app.getHttpServer()).get(
        `/articles/unpublished/${id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(id);
    }
  });

  it('/articles/:articleId (PATCH) - success', async () => {
    // update a published article
    const allResponse = await request(app.getHttpServer()).get('/articles');

    expect(allResponse.status).toBe(200);
    expect(Array.isArray(allResponse.body)).toBe(true);
    expect(allResponse.body.length).toBeGreaterThan(0);

    const articleId = allResponse.body[0].id;

    const updatedData: UpdateArticleRequest = {
      title: 'Updated Title from E2E',
    };

    const response = await request(app.getHttpServer())
      .patch(`/articles/${articleId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', articleId);
  });

  it('/articles/:articleId (DELETE) - success', async () => {
    // delete an article
    const allResponse = await request(app.getHttpServer()).get('/articles');

    expect(allResponse.status).toBe(200);
    expect(Array.isArray(allResponse.body)).toBe(true);
    expect(allResponse.body.length).toBeGreaterThan(0);

    const articleId = allResponse.body[0].id;

    const response = await request(app.getHttpServer()).delete(
      `/articles/${articleId}`,
    );

    expect(response.status).toBe(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
