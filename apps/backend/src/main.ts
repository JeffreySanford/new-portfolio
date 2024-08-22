import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

function setupSwagger(app: INestApplication) {
  return of(app).pipe(
    map(app => {
      const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('auth')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
      return app;
    })
  );
}

function bootstrap() {
  from(NestFactory.create(AppModule)).pipe(
    switchMap(app => {
      return from(app.init()).pipe(
        switchMap(() => setupSwagger(app)),
        map(() => app)
      );
    }),
    switchMap(app => {
      const port = process.env.PORT || 3000;
      return from(app.listen(port)).pipe(
        map(() => {
          console.log(`Application is running on: http://localhost:${port}`);
          return app;
        })
      );
    }),
    catchError(err => {
      console.error('Error starting application', err);
      process.exit(1);
      return of(null);
    })
  ).subscribe();
}

bootstrap();