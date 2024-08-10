import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  validateUser(username: string, pass: string): Observable<User> {
    return from(this.usersService.findOne(username)).pipe(
      map(user => {
        if (user && user.password === pass) {
          const { ...result } = user;
          return result;
        }
        throw new Error('Invalid username or password');
      })
    );
  }
}