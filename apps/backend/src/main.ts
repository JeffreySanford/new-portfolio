import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function getHttpsOptions() {
  const envFilePath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  console.log(`Loading environment variables from: ${envFilePath}`);
  dotenv.config({ path: envFilePath });

  const keyPath = "C:\\repos\\new-portfolio\\apps\\backend\\.env\\ssl\\server.key";
  const certPath ="C:\\repos\\new-portfolio\\apps\\backend\\.env\\ssl\\server.crt";

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error(`SSL key or certificate file not found. Key path: ${keyPath}, Cert path: ${certPath}`);
    process.exit(1);
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function bootstrap() {
  const httpsOptions = getHttpsOptions();

  from(NestFactory.create(AppModule, { httpsOptions })).pipe(
    switchMap(app => {
      setupSwagger(app);
      return from(app.listen(3000));
    })
  ).subscribe({
    next: () => console.log('Application is running on: https://localhost:3000'),
    error: (err) => console.error('Error starting application', err)
  });
}

bootstrap();