import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTAuthService } from './jwt.service'; // Import JWTAuthService
import { UsersService } from '../../users/users.service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [JwtService, JWTAuthService, UsersService], // Provide JWTAuthService
  exports: [JwtService, JWTAuthService] // Export JWTAuthService
})
export class JwtModule { }
