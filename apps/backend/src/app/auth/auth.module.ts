import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Strategy } from './oauth2/oauth2.strategy';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'oauth2' }),
    JwtModule
  ],
  providers: [
    AuthService,
    OAuth2Strategy
  ],
  exports: [AuthService]
})
export class AuthModule { }
