import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../user/users.service';
import { UsersModule } from '../../user/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    JwtService,
    UsersService],
  exports: [AuthService],
})
export class AuthModule { }
