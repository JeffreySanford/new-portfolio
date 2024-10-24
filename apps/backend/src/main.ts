import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

// Load environment variables based on NODE_ENV
const envFilePath = process.env.NODE_ENV === 'production' ? '.production.env' : '.env';
dotenv.config({ path: envFilePath });

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;

  // Use environment variables if provided, otherwise fallback to default paths
  const keyPath = process.env.KEY_PATH || (isProduction
    ? '/etc/letsencrypt/live/jeffreysanford.us/privkey.pem'
    : './apps/backend/ssl/server.key');

  const certPath = process.env.CERT_PATH || (isProduction
    ? '/etc/letsencrypt/live/jeffreysanford.us/fullchain.pem'
    : './apps/backend/ssl/server.crt');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    throw new Error(`SSL certificate files not found. Key path: ${keyPath}, Cert path: ${certPath}`);
  }

  const httpsOptions = {
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'https://jeffreysanford.us', 'https://www.jeffreysanford.us'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger setup for development
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth() // Optionally add authorization if needed
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    console.log('Swagger API documentation is available at /api-docs');
  }

  // Start the application
  await app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}

bootstrap();
