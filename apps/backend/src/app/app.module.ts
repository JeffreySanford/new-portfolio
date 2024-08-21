import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '.', 'ssl'),
    }),
    AuthModule,
    UsersModule,
    HttpModule,
    JwtModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: getHttpsOptions(),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

function getHttpsOptions() {
  const keyPath = join(__dirname, '..', '..', 'ssl', 'server.key');
  const certPath = join(__dirname, '..', '..', 'ssl', 'server.crt');

  try {
    const key = readFileSync(keyPath);
    const cert = readFileSync(certPath);
    return { key, cert };
  } catch (err) {
    console.error(`SSL key or certificate file not found. Key path: ${keyPath}, Cert path: ${certPath}`);
    process.exit(1);
  }
}

bootstrap();