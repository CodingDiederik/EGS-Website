import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import YAML from 'yaml';
import { runseeds } from './seeds/seed';
import { ValidationPipe } from '@nestjs/common';
import { EntityNotFoundErrorFilter } from './common/filters/notFound.filter';
import cookieParser from 'cookie-parser';
import { AUTH_COOKIE_NAME } from './auth/auth.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  const orm = app.get(DataSource);
  if (!orm.isInitialized) {
    await orm.initialize();
  }

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('EGS Backend API')
      .setDescription('API documentation for the EGS Backend')
      .setVersion('1.0')
      .addCookieAuth(
        AUTH_COOKIE_NAME,
        {
          type: 'apiKey',
          in: 'cookie',
        },
        AUTH_COOKIE_NAME,
      )
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig, {
        ignoreGlobalPrefix: false,
      });
    SwaggerModule.setup('docs', app, documentFactory(), {
      yamlDocumentUrl: 'docs/yaml',
    });

    const out = resolve(__dirname, '../../../packages/api-spec/openapi.yaml');
    mkdirSync(dirname(out), { recursive: true });
    const document = documentFactory();
    writeFileSync(out, YAML.stringify(document, { indent: 2 }));

    await runseeds(orm);
  }

  await orm.runMigrations();

  await app.listen(process.env.PORT ?? 8080);
}

void bootstrap();
