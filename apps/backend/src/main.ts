import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { environment } from './environments/environment';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const isProduction = environment.production;
  Logger.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

  const host = environment.host;
  const port = environment.port;

  const keyPath = environment.keyPath;
  const certPath = environment.certPath;

  console.dir({ host, port, keyPath, certPath });

  let httpsOptions = {};
  if (isProduction) {
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      throw new Error(`SSL certificate files not found. Key path: ${keyPath}, Cert path: ${certPath}`);
    }

    httpsOptions = {
      key: fs.readFileSync(keyPath, 'utf8'),
      cert: fs.readFileSync(certPath, 'utf8'),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'https://jeffreysanford.us', 'https://www.jeffreysanford.us'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger setup for both development and production
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth() // Optionally add authorization if needed
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  Logger.log('Swagger API documentation is available at /api-docs');

  // Protect other resources in production
  if (isProduction) {
    // Example: Use a guard or middleware to protect routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path !== '/api-docs' && !req.headers.authorization) {
        return res.status(403).send('Forbidden');
      }
      next();
    });
  }

  await app.listen(port, host);
  Logger.log(`Server is running on https://${host}:${port}`);
}

bootstrap();