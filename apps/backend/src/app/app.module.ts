import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OpenAiController } from './openai/openai.controller';
import { HttpModule } from '@nestjs/axios';
import { OpenAiService } from './openai/openai.service';

@Module({
  imports: [AuthModule, UsersModule, HttpModule],
  controllers: [AppController, OpenAiController],
  providers: [AppService, OpenAiService],
})
export class AppModule {}
