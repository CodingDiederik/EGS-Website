import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';
import YAML from 'yaml';
import { runseeds } from './seeds/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const orm = app.get(DataSource);
  if (!orm.isInitialized) {
    await orm.initialize();
  }

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('EGS Backend API')
      .setDescription('API documentation for the EGS Backend')
      .setVersion('1.0')
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
