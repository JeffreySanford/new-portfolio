import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  validateUser(username: string, pass: string): Observable<any> {
    return from(this.usersService.findOne(username)).pipe(
      map(user => {
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      })
    );
  }
}