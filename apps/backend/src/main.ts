import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// Load environment variables from .env file
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

// Function to set up Swagger documentation
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
      console.log('Swagger documentation set up');
      return app;
    })
  );
}

// Main bootstrap function to start the application
function bootstrap() {
  from(NestFactory.create(AppModule)).pipe(
    switchMap(app => {
      // Enable CORS
      const corsOptions: CorsOptions = {
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      };
      app.enableCors(corsOptions);
      console.log('CORS enabled with options:', corsOptions);

      // Initialize the application
      return from(app.init()).pipe(
        switchMap(() => setupSwagger(app)),
        map(() => app)
      );
    }),
    switchMap(app => {
      // Start listening on the specified port
      const port = process.env.PORT || 3000;
      return from(app.listen(port)).pipe(
        map(() => {
          console.log(`Application is running on: http://localhost:${port}`);
          return app;
        })
      );
    }),
    catchError(err => {
      // Handle errors during application startup
      console.error('Error starting application', err);
      process.exit(1);
      return of(null);
    })
  ).subscribe();
}

// Start the application
bootstrap();