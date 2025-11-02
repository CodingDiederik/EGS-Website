import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EGS Backend API')
    .setDescription('API documentation for the EGS Backend')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, {ignoreGlobalPrefix: true});
  SwaggerModule.setup('docs', app, documentFactory());

  await app.listen(process.env.PORT ?? 8080);
}

void bootstrap();
