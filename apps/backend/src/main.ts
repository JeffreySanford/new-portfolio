import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getHttpsOptions } from './app/common/http-options';
import { from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

function bootstrap() {
  from(NestFactory.create(AppModule, {
    httpsOptions: getHttpsOptions(),
  })).pipe(
    switchMap(app => {
      const configService = app.get(ConfigService);
      let port = configService.get<number>('PORT') || 3000;

      const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      const listenWithRetry = (retryCount = 0) => {
        return from(app.listen(port)).pipe(
          catchError((err: Error): any => {
            if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE' && retryCount < 5) {
              console.warn(`Port ${port} in use, retrying with port ${port + 1}`);
              port += 1;
              return listenWithRetry(retryCount + 1);
            }
            return throwError(err);
          })
        );
      };

      return listenWithRetry().pipe(
        map(() => port) // Pass the port to the next operator
      );
    })
  ).subscribe({
    next: (port) => console.log(`Application is running on: http://localhost:${port}`),
    error: (err) => console.error('Error starting application', err),
  });
}

bootstrap();