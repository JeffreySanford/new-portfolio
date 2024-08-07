import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

function bootstrap() {
  from(NestFactory.create(AppModule)).pipe(
    switchMap(app => {
      const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('auth')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      return from(app.listen(3000));
    })
  ).subscribe({
    next: () => console.log('Application is running on: http://localhost:3000'),
    error: (err) => console.error('Error starting application', err)
  });
}

bootstrap();