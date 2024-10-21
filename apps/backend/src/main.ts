import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as fs from 'fs';
import { from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
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
          origin: process.env.CORS_ORIGIN,
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
        const port = process.env.PORT || 3000;
        const host = process.env.NODE_ENV === 'production' ? '128.199.8.63' : '0.0.0.0';
        return from(app.listen(port, host)).pipe(
          tap(() => {
            console.log(`Application is running on: ${app.getUrl()}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
            console.log(`Listening on port: ${port}`);
            console.log(`Listening on host: ${host}`);
          })
        );
      })
    ).subscribe();
}

bootstrap();