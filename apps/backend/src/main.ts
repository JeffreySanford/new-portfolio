import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as fs from 'fs';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpsOptions = isProduction
    ? {
        key: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem'),
      }
    : undefined;

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

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

  await app.listen(process.env.PORT || 3000, 'jeffreysanford.us');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
}

bootstrap();