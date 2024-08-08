import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.interface';

@Injectable()
export class JWTAuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    validateUser(username: string, pass: string): Observable<User | null> {
        return this.usersService.findOne(username).pipe(
            switchMap(user =>
                user ? from(bcrypt.compare(pass, user.password)).pipe(
                    map(isMatch => isMatch ? { ...user, password: undefined, id: (user as User).id } : null)
                ) : of(null)
            )
        );
    }

    login(user: User): Observable<{ access_token: string }> {
        const payload: JwtPayload = { username: user.username, sub: user.id };
        return from(this.jwtService.signAsync(payload)).pipe(
            map(access_token => ({ access_token }))
        );
    }

    sign(payload: JwtPayload): Observable<string> {
        return from(this.jwtService.signAsync(payload));
    }
}