import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as fs from 'fs';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // HTTPS options for production, using Let's Encrypt certificates
  const httpsOptions = isProduction
    ? {
        key: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem'),
      }
    : undefined;

  // Create the NestJS application
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Jeffrey Sanford')
    .setDescription('Portfolio for Jeffrey Sanford')
    .setVersion('1.0')
    .addTag('portfolio')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Listen on the specified port and address
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  // Log application information
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
}

bootstrap();