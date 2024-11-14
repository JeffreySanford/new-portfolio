import * as fs from 'fs';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { environment } from './environments/environment';

function bootstrap() {
  const isProduction = environment.production;
  Logger.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

  const host = environment.host;
  const port = environment.port;

  const keyPath = environment.keyPath;
  const certPath = environment.certPath;

  console.dir({ host, port, keyPath, certPath });

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    throw new Error(`SSL certificate files not found. Key path: ${keyPath}, Cert path: ${certPath}`);
  }

  const httpsOptions = {
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
  };

  const app$ = from(NestFactory.create(AppModule, { httpsOptions }));

  app$.pipe(
    tap(app => {
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
        app.use((req: { path: string; headers: { authorization: string | undefined; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; }, next: () => void) => {
          if (req.path !== '/api-docs' && !req.headers.authorization) {
            return res.status(403).send('Forbidden');
          }
          next();
        });
      }
    }),
    switchMap(app => from(app.listen(port, host)).pipe(
      tap(() => {
        Logger.log(`Server is running on https://${host}:${port}`);
      })
    )),
    catchError(err => {
      Logger.error('Error starting the application', err);
      return of(err);
    })
  ).subscribe();
}

bootstrap();