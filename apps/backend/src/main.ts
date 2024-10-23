import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as fs from 'fs';
import { from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from './environments/environment';

async function bootstrap() {
  const isProduction = environment.production;
  const host = environment.host;
  const port = environment.port;

  const httpsOptions = isProduction
    ? {
        key: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem'),
      }
    : undefined;

  const app$ = from(NestFactory.create(AppModule, { httpsOptions }));

  app$.pipe(
    tap(app => {
      app.enableCors({
        origin: ['http://localhost:4200', 'https://jeffreysanford.us', 'https://www.jeffreysanford.us'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });

      const options = new DocumentBuilder()
        .setTitle('Jeffrey Sanford')
        .setDescription('Portfolio for Jeffrey Sanford')
        .setVersion('1.0')
        .addTag('portfolio')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api', app, document);
    }),
    switchMap(app => {
      return from(app.listen(port, host)).pipe(
        tap(() => {
          console.log(`Application is running on: ${host}:${port}`);
          console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
        })
      );
    })
  ).subscribe();
}

bootstrap();