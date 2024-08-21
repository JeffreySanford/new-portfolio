import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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